import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';

@Injectable()
export class FindOrdersBySerialNumberUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute(serialNumber: string) {
    return this.repository.findBySerialNumber(serialNumber);
  }
}
