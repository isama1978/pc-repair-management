import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';

@Injectable()
export class FindOrdersByTechnicianUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute(technicianId: string) {
    return this.repository.findByTechnician(technicianId);
  }
}
