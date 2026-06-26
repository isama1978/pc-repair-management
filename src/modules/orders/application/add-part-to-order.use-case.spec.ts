import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AddPartToOrderUseCase } from './add-part-to-order.use-case';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { InventoryRepository } from '../../inventory/domain/inventory.repository';
// Importamos tu repositorio y el TOKEN
import {
  OrderPartsRepository,
  ORDER_PARTS_REPOSITORY,
} from '../domain/order-parts.repository';
import { WorkOrder, WorkOrderStatus } from '../domain/work-order.entity';
import { InventoryItem } from 'src/modules/inventory/domain/inventory-item.entity';

describe('AddPartToOrderUseCase', () => {
  let useCase: AddPartToOrderUseCase;
  let orderRepository: jest.Mocked<WorkOrderRepository>;
  let inventoryRepository: jest.Mocked<InventoryRepository>;
  let orderPartsRepository: jest.Mocked<OrderPartsRepository>;

  beforeEach(async () => {
    // 1. Mocks con TUS métodos reales
    const mockOrderPartsRepo = {
      addPart: jest.fn(),
      findByOrderId: jest.fn(),
      removePart: jest.fn(),
      sumTotalByOrderId: jest.fn(),
    };

    const mockWorkOrderRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    const mockInventoryRepo = {
      findBySku: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    const mockDataSource = {
      transaction: jest.fn().mockImplementation((cb) => cb()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddPartToOrderUseCase,
        { provide: DataSource, useValue: mockDataSource },
        { provide: WorkOrderRepository, useValue: mockWorkOrderRepo },
        { provide: InventoryRepository, useValue: mockInventoryRepo },
        { provide: OrderPartsRepository, useValue: mockOrderPartsRepo },
        // 🎯 Usamos el TOKEN que definiste
        { provide: ORDER_PARTS_REPOSITORY, useValue: mockOrderPartsRepo },
      ],
    }).compile();

    useCase = module.get<AddPartToOrderUseCase>(AddPartToOrderUseCase);
    orderRepository = module.get(WorkOrderRepository);
    inventoryRepository = module.get(InventoryRepository);
    // 🎯 Obtenemos el mock usando el TOKEN
    orderPartsRepository = module.get(ORDER_PARTS_REPOSITORY);
  });

  // it('debería agregar una parte exitosamente usando addPart', async () => {
  //   // 1. ARRANGE
  //   const orderId = 'order-123';
  //   const sku = 'RAM-16GB';
  //   const quantity = 1;

  //   const mockOrder = new WorkOrder({
  //     id: orderId,
  //     status: WorkOrderStatus.RECEIVED,
  //     clientId: 'c1',
  //     equipmentType: 'PC',
  //     brand: 'Dell',
  //     model: 'XPS 15',
  //     laborCost: 100,
  //     reportedFailure: 'Memory issue',
  //     totalAmount: 100,
  //   });
  //   const mockItem = new InventoryItem({
  //     sku,
  //     nameKey: 'RAM',
  //     stock: 10,
  //     unitPrice: 50,
  //     minStockAlert: 2,
  //   });

  //   orderRepository.findById.mockResolvedValue(mockOrder as any);
  //   orderRepository.save.mockResolvedValue(mockOrder as any);
  //   orderRepository.update.mockResolvedValue(undefined);
  //   inventoryRepository.findBySku.mockResolvedValue(mockItem as any);
  //   inventoryRepository.findById.mockResolvedValue(mockItem as any);
  //   inventoryRepository.update.mockResolvedValue(mockItem as any);
  //   inventoryRepository.save.mockResolvedValue(mockItem as any);

  //   // Configuramos el mock para que la promesa se resuelva (void)
  //   orderPartsRepository.addPart.mockResolvedValue(undefined);

  //   await useCase.execute({ orderId: 'order-123', partId: 'RAM', quantity });

  //   // ✅ VERIFICACIÓN: Aquí usamos la variable y el método correcto
  //   expect(orderPartsRepository.addPart).toHaveBeenCalled();
  //   expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
  //   expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
  //   expect(orderRepository.update).toHaveBeenCalled();
  //   expect(inventoryRepository.findById).toHaveBeenCalledWith(sku);
  //   expect(inventoryRepository.update).toHaveBeenCalledWith(sku, { stock: 9 });
  //   expect(inventoryRepository.save).toHaveBeenCalledWith(mockItem);
  //   expect(mockItem.stock).toBe(9);
  // });
  it('debería agregar una parte exitosamente usando addPart', async () => {
    const orderId = 'order-123';
    const sku = 'RAM-16GB';

    // 1. Asegúrate de que el ITEM tenga unitPrice (para evitar el NaN)
    const mockItem = new InventoryItem({
      sku,
      nameKey: 'RAM',
      stock: 10,
      unitPrice: 50, // 👈 Importante
      minStockAlert: 2,
    });

    const mockOrder = new WorkOrder({
      id: orderId,
      status: WorkOrderStatus.RECEIVED,
      clientId: 'c1',
      equipmentType: 'PC',
      brand: 'Dell',
      model: 'XPS 15',
      laborCost: 100,
      reportedFailure: 'Memory issue',
      totalAmount: 100, // Inicializado con el costo de mano de obra
    });

    orderRepository.findById.mockResolvedValue(mockOrder as any);
    inventoryRepository.findById.mockResolvedValue(mockItem as any);

    // 🎯 ACÁ ESTÁ EL FIX: Decile al mock que devuelva un número (ej: 50)
    orderPartsRepository.sumTotalByOrderId.mockResolvedValue(50);

    orderPartsRepository.addPart.mockResolvedValue(undefined);
    orderRepository.update.mockResolvedValue(undefined);

    // 2. EJECUCIÓN
    await useCase.execute({ orderId, partId: sku, quantity: 1 });

    // 3. VERIFICACIÓN
    // Si laborCost era 100 y el mock de sumTotalByOrderId devolvió 50
    expect(mockOrder.totalAmount).toBe(150);
  });
});
