/* CREATE ORDER USE CASE
   Coordinates the logic to register a new repair order.
   No longer needs manual try-catch for translations.
*/

import { Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { WorkOrder, WorkOrderProps } from '../domain/work-order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly repository: WorkOrderRepository) {}

  async execute(props: WorkOrderProps) {
    // 1. Create domain entity
    // This will automatically throw specific DomainExceptions
    // (like MissingRequirementException or InvalidDomainValueException)
    const order = new WorkOrder(props);

    // 2. Persist in database
    return await this.repository.save(order);
  }
}
