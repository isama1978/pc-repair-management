// src/modules/inventory/domain/inventory.repository.ts
import { InventoryItem } from './inventory-item.entity';

export abstract class InventoryRepository {
  abstract findById(id: string): Promise<InventoryItem | null>;
  abstract findBySku(sku: string): Promise<InventoryItem | null>;
  abstract findAll(): Promise<InventoryItem[]>;
  abstract save(item: InventoryItem): Promise<void>;
  abstract update(item: InventoryItem): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByOrderId(orderId: string): Promise<InventoryItem[]>;
  abstract deleteByOrderId(orderId: string): Promise<void>;
  abstract findLowStock(): Promise<InventoryItem[]>;
}

export const INVENTORY_REPOSITORY = 'INVENTORY_REPOSITORY';
