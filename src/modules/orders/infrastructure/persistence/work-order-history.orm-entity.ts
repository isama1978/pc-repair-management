import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
// Importamos el Enum que ya definimos antes
import { WorkOrderStatus } from '../../domain/work-order.entity';

@Entity('order_history')
export class WorkOrderHistoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' }) // Mapea orderId -> order_id
  orderId: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true }) // Mapea userId -> user_id
  userId: string;

  // Usamos 'varchar' o 'enum' según cómo esté en Neon
  @Column({ type: 'varchar', name: 'previous_status', nullable: true })
  previousStatus: string | null;

  @Column({ type: 'varchar', name: 'new_status' })
  newStatus: string;

  @Column({ type: 'text', name: 'notes', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'changed_at' }) // Mapea changedAt -> changed_at
  changedAt: Date;

  @Column({ type: 'varchar', name: 'serial_number', nullable: true })
  serialNumber: string | null;

  @Column({ type: 'varchar', name: 'aesthetic_condition', nullable: true })
  aestheticCondition: string | null;

  @Column({ type: 'varchar', name: 'reported_failure', nullable: true })
  reportedFailure: string | null;

  @Column({
    type: 'decimal',
    name: 'labor_cost',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  laborCost: number | null;

  @Column({
    type: 'decimal',
    name: 'total_amount',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalAmount: number | null;

  @Column({ type: 'text', name: 'technical_diagnosis', nullable: true })
  technicalDiagnosis: string | null;
}
