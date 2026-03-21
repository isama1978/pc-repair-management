// src/modules/inventory/infrastructure/persistence/typeorm-inventory.repository.ts

import { Injectable } from '@nestjs/common';
import { InventoryItemOrmEntity } from './inventory-item.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../../domain/inventory-item.entity';
import { InventoryRepository } from '../../domain/inventory.repository';
import { SystemConfigurationException } from 'src/modules/common/domain/exceptions/SystemConfigurationException';

@Injectable()
export class TypeOrmInventoryRepository implements InventoryRepository {
  constructor(
    @InjectRepository(InventoryItemOrmEntity)
    private readonly repository: Repository<InventoryItemOrmEntity>,
  ) {}

  async findBySku(sku: string): Promise<InventoryItem | null> {
    const orm = await this.repository.findOne({ where: { sku } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<InventoryItem[]> {
    const orms = await this.repository.find();
    return orms.map(this.toDomain.bind(this));
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async update(item: InventoryItem): Promise<void> {
    if (!item.id) {
      throw new SystemConfigurationException('CANNOT_UPDATE_ITEM_WITHOUT_ID');
    }
    await this.repository.update(item.id, {
      sku: item.sku,
      nameKey: item.nameKey,
      category: item.category,
      stock: item.stock,
      unitPrice: item.unitPrice,
      minStockAlert: item.minStockAlert,
      updatedAt: item.updatedAt,
    });
  }

  async findByOrderId(id: string): Promise<InventoryItem[]> {
    const orms = await this.repository.find({ where: { id } });
    return orms.map(this.toDomain.bind(this));
  }

  async findLowStock(): Promise<InventoryItem[]> {
    const orms = await this.repository
      .createQueryBuilder('inventory')
      .where('inventory.stock <= inventory.minStockAlert')
      .getMany();

    return orms.map((orm) => this.toDomain(orm));
  }

  async deleteByOrderId(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async save(item: InventoryItem): Promise<void> {
    const orm = this.repository.create({
      sku: item.sku,
      nameKey: item.nameKey,
      category: item.category,
      unitPrice: item.unitPrice,
      stock: item.stock,
      // ... mapear resto de campos
    });
    await this.repository.save(orm);
  }

  private toDomain(orm: InventoryItemOrmEntity): InventoryItem {
    return new InventoryItem({
      id: orm.id,
      sku: orm.sku,
      nameKey: orm.nameKey,
      category: orm.category,
      stock: orm.stock,
      unitPrice: orm.unitPrice,
      minStockAlert: orm.minStockAlert,
    });
  }
}
