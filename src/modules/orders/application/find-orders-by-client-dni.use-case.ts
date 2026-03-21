import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';

@Injectable()
export class FindOrdersByClientDniUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute(dni: string) {
    return this.repository.findByClientDni(dni);
  }
}
