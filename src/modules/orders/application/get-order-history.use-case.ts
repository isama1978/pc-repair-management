import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';

@Injectable()
export class GetOrderHistoryUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute(orderId: string) {
    // 1. Validar que la orden existe
    const order = await this.repository.findById(orderId);
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');

    // 2. Traer su historia
    return this.repository.findHistoryByOrderId(orderId);
  }
}
