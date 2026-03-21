import { Injectable } from '@nestjs/common';
import { FindAllInventoryItemsUseCase } from './find-all-inventory-items.use-case';
import { UpdateInventoryItemUseCase } from './update-inventory-item-stock.use-case';
import { IncreaseInventoryItemStockUseCase } from './increase-inventory-item-stock.use-case';
import { DecreaseInventoryItemStockUseCase } from './decrease-inventory-item-stock.use-case';
import { CreateInventoryItemUseCase } from './create-inventory-item.use.case';
import { CreateInventoryItemDto } from '../infrastructure/http/dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from '../infrastructure/http/dto/update-inventory-item.dto';
import { FindLowStockInventoryItemsUseCase } from './find-low-stock-inventory.use-case';

@Injectable()
export class InventoryService {
  constructor(
    private readonly findAllUseCase: FindAllInventoryItemsUseCase,
    private readonly findLowStockUseCase: FindLowStockInventoryItemsUseCase,
    private readonly createUseCase: CreateInventoryItemUseCase,
    private readonly updateUseCase: UpdateInventoryItemUseCase,
    private readonly increaseStockUseCase: IncreaseInventoryItemStockUseCase,
    private readonly decreaseStockUseCase: DecreaseInventoryItemStockUseCase,
  ) {}

  async findAll() {
    return await this.findAllUseCase.execute();
  }

  // Nuevo método para buscar ítems con stock bajo
  async findLowStockItems() {
    return await this.findLowStockUseCase.execute();
  }

  async create(data: CreateInventoryItemDto) {
    return await this.createUseCase.execute(data);
  }

  async update(id: string, data: UpdateInventoryItemDto) {
    return await this.updateUseCase.execute(id, data);
  }

  async adjustStock(
    id: string,
    quantity: number,
    type: 'increase' | 'decrease',
  ) {
    if (type === 'increase') {
      return await this.increaseStockUseCase.execute(id, quantity);
    }
    return await this.decreaseStockUseCase.execute(id, quantity);
  }
}
