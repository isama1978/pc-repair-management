import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WorkOrderRepository } from 'src/modules/orders/domain/work-order.repository';
import { InventoryRepository } from '../../inventory/domain/inventory.repository';
import { OrderPartsRepository } from 'src/modules/orders/domain/order-parts.repository';
import { OrderPart } from 'src/modules/orders/domain/order-part.entity';
import { InsufficientStockException } from '../../inventory/domain/exceptions/insufficient-stock.exception';
import { OrderNotFoundException } from '../domain/exceptions/order-not-found.exception';
import { PartNotFoundException } from '../domain/exceptions/part-not-found.exception';

@Injectable()
export class AddPartToOrderUseCase {
  constructor(
    private readonly dataSource: DataSource, // Necesario para la transacción
    private readonly orderRepo: WorkOrderRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly orderPartsRepo: OrderPartsRepository,
  ) {}

  async execute({
    orderId,
    partId,
    quantity,
  }: {
    orderId: string;
    partId: string;
    quantity: number;
  }) {
    // Usamos la transacción para asegurar atomicidad
    return await this.dataSource.transaction(async (manager) => {
      // 1. Buscar la orden y el repuesto
      // Es importante usar los datos más frescos de la DB
      const order = await this.orderRepo.findById(orderId);
      const part = await this.inventoryRepo.findById(partId);

      if (!order) {
        throw new OrderNotFoundException(orderId);
      }
      if (!part) {
        throw new PartNotFoundException(partId);
      }
      if (part.stock < quantity) {
        throw new InsufficientStockException(part.sku, quantity, part.stock);
      }

      // 2. Lógica de dominio: Descontar stock en memoria
      part.decreaseStock(quantity);

      // 3. Persistencia: Registrar la parte en la orden
      const snapshotPrice = part.unitPrice;
      const orderPart = new OrderPart({
        orderId,
        partId,
        quantity,
        priceAtSnapshot: snapshotPrice,
        partName: part.nameKey,
      });

      // Guardamos la relación
      await this.orderPartsRepo.addPart(orderPart);

      // 4. Persistencia: Actualizar el stock del inventario
      await this.inventoryRepo.update(part);

      // 5. Recalcular el total real de la orden
      // Usamos el método que suma todo lo que ya existe en la DB para esa orden
      const partsTotal = await this.orderPartsRepo.sumTotalByOrderId(orderId);
      const newTotal = Number(order.laborCost || 0) + partsTotal;

      // 6. Persistencia: Actualizar la orden con el nuevo monto
      order.updateTechnicalData({ totalAmount: newTotal });
      await this.orderRepo.update(order);

      return {
        message: 'Part added successfully',
        newTotal,
        currentStock: part.stock,
      };
    });
    // Si algo falla dentro del bloque anterior, TypeORM hace ROLLBACK automáticamente.
  }
}
