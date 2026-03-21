// src/modules/inventory/application/find-all-inventory-items.use-case.ts
import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../domain/inventory.repository';

@Injectable()
export class FindAllInventoryItemsUseCase {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute() {
    const items = await this.inventoryRepo.findAll();

    // Devolvemos los datos limpios y calculamos el estado de stock bajo
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
