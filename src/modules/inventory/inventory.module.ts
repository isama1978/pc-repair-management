import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemOrmEntity } from './infrastructure/persistance/inventory-item.orm-entity';
import { InventoryRepository } from './domain/inventory.repository';
import { TypeOrmInventoryRepository } from './infrastructure/persistance/typeorm-inventory.repository';
import { InventoryService } from './application/inventory.service';
import { FindAllInventoryItemsUseCase } from './application/find-all-inventory-items.use-case';
import { UpdateInventoryItemUseCase } from './application/update-inventory-item-stock.use-case';
import { DecreaseInventoryItemStockUseCase } from './application/decrease-inventory-item-stock.use-case';
import { IncreaseInventoryItemStockUseCase } from './application/increase-inventory-item-stock.use-case';
import { CreateInventoryItemUseCase } from './application/create-inventory-item.use.case';
import { InventoryController } from './infrastructure/http/inventory.controller';
import { FindLowStockInventoryItemsUseCase } from './application/find-low-stock-inventory.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItemOrmEntity])],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    CreateInventoryItemUseCase,
    FindAllInventoryItemsUseCase,
    UpdateInventoryItemUseCase,
    DecreaseInventoryItemStockUseCase,
    IncreaseInventoryItemStockUseCase,
    FindLowStockInventoryItemsUseCase,
    {
      provide: InventoryRepository,
      useClass: TypeOrmInventoryRepository,
    },
  ],
})
export class InventoryModule {}
