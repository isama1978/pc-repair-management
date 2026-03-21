import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../domain/inventory.repository';
import { EntityNotFoundException } from 'src/modules/common/domain/exceptions/EntityNotFoundException';

@Injectable()
export class IncreaseInventoryItemStockUseCase {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(id: string, quantity: number) {
    const item = await this.inventoryRepo.findById(id);
    if (!item) throw new EntityNotFoundException('InventoryItem', id);

    item.addStock(quantity);
    await this.inventoryRepo.update(item);
    return item;
  }
}
