import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';

@Injectable()
export class FindAllOrdersUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute() {
    return this.repository.findAll();
  }
}
