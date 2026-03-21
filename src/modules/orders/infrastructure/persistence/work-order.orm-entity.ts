import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientOrmEntity } from '../../../clients/infrastructure/persistence/client.orm-entity';

@Entity('repair_orders')
export class WorkOrderOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // Postgres maneja el SERIAL automáticamente
  folio: number;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ClientOrmEntity)
  @JoinColumn({ name: 'client_id' })
  client: ClientOrmEntity;

  @Column({ name: 'technician_id', nullable: true })
  technicianId?: string;

  @Column({ name: 'equipment_type' })
  equipmentType: string;

  @Column()
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ name: 'serial_number', nullable: true }) // Nueva columna
  serialNumber: string;

  @Column({ name: 'aesthetic_condition', type: 'text', nullable: true }) // Nueva columna
  aestheticCondition: string;

  @Column({ name: 'reported_failure', type: 'text' })
  reportedFailure: string;

  @Column({ name: 'technical_diagnosis', type: 'text', nullable: true }) // Nueva columna
  technicalDiagnosis: string;

  @Column({ type: 'varchar', default: 'RECIBIDO' })
  status: string;

  // Adaptado de estimated_price a labor_cost según tu SQL
  @Column({
    type: 'numeric',
    name: 'labor_cost',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  laborCost: number;

  // Adaptado de final_price a total_amount según tu SQL
  @Column({
    type: 'numeric',
    name: 'total_amount',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalAmount: number;

  @CreateDateColumn({ name: 'entry_date', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'modify_date',
    type: 'timestamp',
    nullable: false, // 👈 Queremos que siempre tenga un valor
    default: () => 'CURRENT_TIMESTAMP', // 👈 Para registros nuevos y existentes
  })
  updatedAt: Date;

  @Column({ name: 'delivery_date', type: 'timestamptz', nullable: true }) // Nueva columna
  deliveryDate: Date;
}
