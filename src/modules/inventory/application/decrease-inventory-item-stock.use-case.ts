// src/modules/inventory/application/decrease-inventory-item-stock.use-case.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InventoryRepository } from '../domain/inventory.repository';

@Injectable()
export class DecreaseInventoryItemStockUseCase {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(id: string, quantity: number) {
    const item = await this.inventoryRepo.findById(id);

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    try {
      // La entidad de dominio se encarga de validar si hay stock suficiente
      item.decreaseStock(quantity);

      await this.inventoryRepo.update(item);

      return {
        id: item.id,
        sku: item.sku,
        newStock: item.stock,
        message: 'Stock adjusted successfully',
      };
    } catch (error) {
      // Capturamos el error de la entidad (INSUFFICIENT_STOCK)
      throw new BadRequestException(error.message);
    }
  }
}
