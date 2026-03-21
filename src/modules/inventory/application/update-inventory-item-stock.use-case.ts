import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../domain/inventory.repository';
import { InventoryProps } from '../domain/inventory-item.entity';

@Injectable()
export class UpdateInventoryItemUseCase {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(id: string, dto: Partial<InventoryProps>) {
    const item = await this.inventoryRepo.findById(id);
    if (!item) throw new Error('ITEM_NOT_FOUND');

    item.update(dto);

    await this.inventoryRepo.update(item);
    return item;
  }
}
