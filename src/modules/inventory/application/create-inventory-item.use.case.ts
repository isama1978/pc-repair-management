import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../domain/inventory.repository';
import { InventoryItem } from '../domain/inventory-item.entity';
import { CreateInventoryItemDto } from '../infrastructure/http/dto/create-inventory-item.dto';
import { SkuAlreadyExistsException } from '../domain/exceptions/sku-already-exists.exception';

@Injectable()
export class CreateInventoryItemUseCase {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(dto: CreateInventoryItemDto) {
    const existing = await this.inventoryRepo.findBySku(dto.sku);
    if (existing) {
      throw new SkuAlreadyExistsException(dto.sku);
    }

    const newItem = new InventoryItem({
      sku: dto.sku,
      nameKey: dto.nameKey,
      category: dto.category,
      stock: dto.stock || 0,
      unitPrice: dto.unitPrice,
      minStockAlert: dto.minStockAlert || 2,
    });

    await this.inventoryRepo.save(newItem);
    return newItem;
  }
}
