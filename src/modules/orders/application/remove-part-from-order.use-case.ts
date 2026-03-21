import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from 'src/modules/orders/domain/work-order.repository';
import { InventoryRepository } from 'src/modules/inventory/domain/inventory.repository';
import { OrderPartsRepository } from 'src/modules/orders/domain/order-parts.repository';
import { EntityNotFoundException } from 'src/modules/common/domain/exceptions/EntityNotFoundException';

@Injectable()
export class RemovePartFromOrderUseCase {
  constructor(
    private readonly orderRepo: WorkOrderRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly orderPartsRepo: OrderPartsRepository,
  ) {}

  async execute(orderPartId: string) {
    // 1. Buscamos el registro en la tabla intermedia
    // Nota: Necesitas añadir findById a tu OrderPartsRepository
    const orderParts = await this.orderPartsRepo.findByOrderId(orderPartId);
    if (!orderParts)
      throw new EntityNotFoundException('OrderPart', orderPartId);

    const { orderId, partId, quantity } = orderParts[0];

    // 2. Devolver stock al inventario
    const part = await this.inventoryRepo.findById(partId);
    if (part) {
      part.addStock(quantity); // Método que creamos en la entidad de dominio
      await this.inventoryRepo.update(part);
    }

    // 3. Eliminar el registro de la tabla intermedia
    await this.orderPartsRepo.removePart(orderPartId);

    // 4. Recalcular el total de la orden de forma segura
    const order = await this.orderRepo.findById(orderId);
    if (order) {
      const partsTotal = await this.orderPartsRepo.sumTotalByOrderId(orderId);
      const newTotal = Number(order.laborCost || 0) + partsTotal;

      order.updateTechnicalData({ totalAmount: newTotal });
      await this.orderRepo.update(order);
    }

    return { message: 'Part removed and stock restored' };
  }
}
