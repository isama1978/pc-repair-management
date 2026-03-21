import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';

@Injectable()
export class FindOrdersByStatusUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute(status: string) {
    return this.repository.findByStatus(status);
  }
}
