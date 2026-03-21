// src/modules/inventory/infrastructure/persistence/inventory-item.orm-entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory')
export class InventoryItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column({ name: 'name_key' })
  nameKey: string;

  @Column({ nullable: true })
  category: string;

  @Column('integer', { default: 0 })
  stock: number;

  @Column('numeric', {
    name: 'unit_price',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value), // Convierte string de Postgres a number
    },
  })
  unitPrice: number;

  @Column({ name: 'min_stock_alert', default: 2 })
  minStockAlert: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
