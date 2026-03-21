import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { OrderHistory } from '../domain/work-order-history.entity';
import { UpdateOrderDto } from '../infrastructure/http/dto/update-order.dto';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute(
    orderId: string,
    technicianId: string,
    data: Partial<UpdateOrderDto>,
  ) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');

    const oldStatus = order.status;

    const { status, notes, ...technicalData } = data;

    // 1. Actualizamos datos técnicos/financieros (Mano de obra, diagnóstico, etc.)
    // Esto ahora funciona sin errores de getters.
    order.updateTechnicalData(technicalData);

    // 2. Procesamos el cambio de estado con las reglas del dominio
    if (status && status !== oldStatus) {
      order.changeStatus(status);
    }

    // 3. Guardamos todo en una sola operación
    await this.repository.update(order);

    const newOrder = new OrderHistory({
      orderId,
      userId: technicianId,
      previousStatus: oldStatus,
      newStatus: status || oldStatus,
      notes: notes || 'Actualización de información',
      serialNumber: order.serialNumber,
      aestheticCondition: order.aestheticCondition,
      reportedFailure: order.reportedFailure,
      laborCost: order.laborCost,
      totalAmount: order.totalAmount,
      technicalDiagnosis: order.technicalDiagnosis,
    });

    // 4. REGISTRO EN EL HISTORIAL
    await this.repository.saveHistory(newOrder);

    return order;
  }
}
