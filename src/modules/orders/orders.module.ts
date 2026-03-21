/* Updated OrdersModule */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './infrastructure/http/orders.controller'; // NEW
import { WorkOrderOrmEntity } from './infrastructure/persistence/work-order.orm-entity';
import { WorkOrderRepository } from './domain/work-order.repository';
import { TypeOrmWorkOrderRepository } from './infrastructure/persistence/typeorm-work-order.repository';
import { CreateOrderUseCase } from './application/create-order.use-case';
import { UpdateOrderStatusUseCase } from './application/update-order-status.use-case';
import { FindAllOrdersUseCase } from './application/find-all-orders.use-case';
import { FindOrdersByTechnicianUseCase } from './application/find-orders-by-technician.use-case';
import { WorkOrderHistoryOrmEntity } from './infrastructure/persistence/work-order-history.orm-entity';
import { GetOrderHistoryUseCase } from './application/get-order-history.use-case';
import { CancelOrderUseCase } from './application/cancel-order.use-case';
import { OrderPartsRepository } from './domain/order-parts.repository';
import { TypeOrmOrderPartsRepository } from './infrastructure/persistence/typeorm-order-parts.repository';
import { InventoryRepository } from '../inventory/domain/inventory.repository';
import { TypeOrmInventoryRepository } from '../inventory/infrastructure/persistance/typeorm-inventory.repository';
import { OrderPartOrmEntity } from './infrastructure/persistence/order-part.orm-entity';
import { InventoryItemOrmEntity } from '../inventory/infrastructure/persistance/inventory-item.orm-entity';
import { RemovePartFromOrderUseCase } from './application/remove-part-from-order.use-case';
import { AddPartToOrderUseCase } from './application/add-part-to-order.use-case';
import { InventoryModule } from '../inventory/inventory.module';
import { FindInventoryItemsByOrderIdUseCase } from './application/find-inventory-item-by-order-id.use-case';
import { FindOrdersByClientDniUseCase } from './application/find-orders-by-client-dni.use-case';
import { FindOrdersBySerialNumberUseCase } from './application/find-orders-by-client-serial-number.use-case';
import { FindOrdersByStatusUseCase } from './application/find-orders-by-client-status.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkOrderOrmEntity,
      WorkOrderHistoryOrmEntity,
      OrderPartOrmEntity,
      InventoryItemOrmEntity,
      InventoryModule,
    ]),
  ],
  controllers: [OrdersController], // REGISTER CONTROLLER HERE
  providers: [
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
    FindAllOrdersUseCase,
    FindOrdersByTechnicianUseCase,
    GetOrderHistoryUseCase,
    CancelOrderUseCase,
    AddPartToOrderUseCase,
    RemovePartFromOrderUseCase,
    FindInventoryItemsByOrderIdUseCase,
    FindOrdersBySerialNumberUseCase,
    FindOrdersByStatusUseCase,
    FindOrdersByClientDniUseCase,
    {
      provide: WorkOrderRepository,
      useClass: TypeOrmWorkOrderRepository,
    },
    {
      provide: OrderPartsRepository,
      useClass: TypeOrmOrderPartsRepository,
    },
    {
      provide: InventoryRepository,
      useClass: TypeOrmInventoryRepository,
    },
  ],
})
export class OrdersModule {}
