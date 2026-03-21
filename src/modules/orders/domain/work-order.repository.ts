/* WORK ORDER REPOSITORY INTERFACE
   This is a "Port" in Hexagonal Architecture.
   It defines HOW we interact with the storage without caring IF it is Postgres, 
   an external API, or a simple Memory Map.
*/

import { OrderHistory } from './work-order-history.entity';
import { WorkOrder } from './work-order.entity';

export abstract class WorkOrderRepository {
  abstract save(order: WorkOrder): Promise<WorkOrder>;
  abstract findById(id: string): Promise<WorkOrder | null>;
  abstract findAll(): Promise<WorkOrder[]>;
  abstract update(order: WorkOrder): Promise<void>;
  abstract findByTechnician(technicianId: string): Promise<WorkOrder[]>;
  abstract saveHistory(history: OrderHistory): Promise<void>;
  abstract findHistoryByOrderId(orderId: string): Promise<OrderHistory[]>;
  abstract findByClientDni(dni: string): Promise<WorkOrder[]>;
  abstract findBySerialNumber(serialNumber: string): Promise<WorkOrder | null>;
  // Nuevos métodos
  abstract findByStatus(status: string): Promise<WorkOrder[]>;
}

// Token for Dependency Injection in NestJS
export const WORK_ORDER_REPOSITORY = 'WORK_ORDER_REPOSITORY';
