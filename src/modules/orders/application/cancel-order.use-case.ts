import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from 'src/modules/orders/domain/work-order.repository';
import { InventoryRepository } from '../../inventory/domain/inventory.repository';
import { OrderPartsRepository } from 'src/modules/orders/domain/order-parts.repository';
import { DataSource } from 'typeorm';
import { WorkOrderStatus } from 'src/modules/orders/domain/work-order.entity';
import { OrderHistory } from '../domain/work-order-history.entity';
import { OrderNotFoundException } from '../domain/exceptions/order-not-found.exception';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly orderRepo: WorkOrderRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly orderPartsRepo: OrderPartsRepository,
  ) {}

  async execute(orderId: string, technicianId: string, notes?: string) {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Validar la orden
      const order = await this.orderRepo.findById(orderId);
      if (!order) throw new OrderNotFoundException(orderId);

      const oldStatus = order.status; // 👈 Guardamos el estado previo para el historial

      // 🛡️ La entidad se encarga de la validación
      order.canBeCancelled();

      // 2 y 3. Devolución de repuestos (Tu lógica actual)
      const assignedParts = await this.orderPartsRepo.findByOrderId(orderId);
      for (const assigned of assignedParts) {
        const inventoryItem = await this.inventoryRepo.findById(
          assigned.partId,
        );
        if (inventoryItem) {
          inventoryItem.addStock(assigned.quantity);
          await this.inventoryRepo.update(inventoryItem);
        }
        await this.orderPartsRepo.removePart(assigned.id!);
      }

      // 4. Resetear la orden
      const laborCost = Number(order.laborCost || 0);
      order.updateTechnicalData({ totalAmount: laborCost });
      order.changeStatus(WorkOrderStatus.CANCELLED);

      await this.orderRepo.update(order);
      // 5. REGISTRO EN EL HISTORIAL (Dentro de la transacción)
      // Usamos los getters de la entidad 'order' para tener los datos frescos
      const historyEntry = new OrderHistory({
        orderId: orderId,
        userId: technicianId,
        previousStatus: oldStatus,
        newStatus: WorkOrderStatus.CANCELLED,
        notes: notes || 'Orden cancelada: repuestos devueltos al stock',
        serialNumber: order.serialNumber,
        aestheticCondition: order.aestheticCondition,
        reportedFailure: order.reportedFailure,
        laborCost: order.laborCost,
        totalAmount: order.totalAmount,
        technicalDiagnosis: order.technicalDiagnosis,
      });
      // Asumiendo que tu repositorio tiene este método
      await this.orderRepo.saveHistory(historyEntry);

      return {
        message: 'Order cancelled, parts returned to stock and history logged',
        partsRestored: assignedParts.length,
        newTotal: laborCost,
      };
    });
  }
}
