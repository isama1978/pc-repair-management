import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../domain/inventory.repository';

@Injectable()
export class FindLowStockInventoryItemsUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute() {
    const items = await this.inventoryRepository.findLowStock();

    return items.map((item) => ({
      id: item.id,
      sku: item.sku,
      nameKey: item.nameKey,
      category: item.category,
      stock: item.stock,
      unitPrice: item.unitPrice,
      isLowStock: item.isLowStock(), // Lógica encapsulada en la entidad de dominio
    }));
  }
}
