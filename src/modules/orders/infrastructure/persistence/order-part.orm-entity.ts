import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryItemOrmEntity } from '../../../inventory/infrastructure/persistance/inventory-item.orm-entity';

@Entity('order_parts')
export class OrderPartOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'part_id' })
  partId: string;

  @Column('integer')
  quantity: number;

  @Column('numeric', {
    name: 'price_at_snapshot',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  priceAtSnapshot: number;

  // Relación para poder traer el nombre del repuesto si lo necesitamos
  @ManyToOne(() => InventoryItemOrmEntity)
  @JoinColumn({ name: 'part_id' })
  part?: InventoryItemOrmEntity;
}
