import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../domain/inventory.repository';

@Injectable()
export class GetInventoryUseCase {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute() {
    const items = await this.inventoryRepo.findAll();

    return items.map((item) => ({
      ...item,
      isLowStock: item.isLowStock(), // Aprovechamos la lógica de la entidad
      status:
        item.stock === 0
          ? 'OUT_OF_STOCK'
          : item.isLowStock()
            ? 'LOW_STOCK'
            : 'OK',
    }));
  }
}
