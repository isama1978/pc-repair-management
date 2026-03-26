import { Test, TestingModule } from '@nestjs/testing';
import { AddPartToOrderUseCase } from './add-part-to-order.use-case';
import { WorkOrderRepository } from '../domain/work-order.repository';
import { InventoryRepository } from '../../inventory/domain/inventory.repository';
import { InsufficientStockException } from '../../inventory/domain/exceptions/insufficient-stock.exception';
import { InventoryItem } from '../../inventory/domain/inventory-item.entity';
import { WorkOrder, WorkOrderStatus } from '../domain/work-order.entity';

describe('AddPartToOrderUseCase', () => {
  let useCase: AddPartToOrderUseCase;
  let orderRepository: jest.Mocked<WorkOrderRepository>;
  let inventoryRepository: jest.Mocked<InventoryRepository>;

  beforeEach(async () => {
    // Definimos los Mocks de los repositorios
    const mockOrderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    const mockInventoryRepository = {
      findBySku: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddPartToOrderUseCase,
        { provide: 'IOrderRepository', useValue: mockOrderRepository },
        { provide: 'IInventoryRepository', useValue: mockInventoryRepository },
      ],
    }).compile();

    useCase = module.get<AddPartToOrderUseCase>(AddPartToOrderUseCase);
    orderRepository = module.get('IOrderRepository');
    inventoryRepository = module.get('IInventoryRepository');
  });

  it('debería agregar una parte exitosamente y descontar stock', async () => {
    // 1. ARRANGUE (Preparación)
    const orderId = 'order-123';
    const sku = 'RAM-16GB';
    const quantity = 1;

    const mockOrder = new WorkOrder({
      id: orderId,
      status: WorkOrderStatus.RECEIVED,
      clientId: 'c1',
      equipmentType: 'PC',
      brand: 'Dell',
      model: 'XPS 15',
      reportedFailure: 'Memory issue',
    });
    const mockItem = new InventoryItem({
      sku,
      nameKey: 'RAM Memory',
      stock: 10,
      unitPrice: 50,
      minStockAlert: 2,
    });

    orderRepository.findById.mockResolvedValue(mockOrder);
    inventoryRepository.findBySku.mockResolvedValue(mockItem);

    // 2. ACT (Acción)
    await useCase.execute({ orderId, partId: sku, quantity });

    // 3. ASSERT (Verificación)
    expect(mockItem.stock).toBe(9); // El stock bajó de 10 a 9
    expect(orderRepository.save).toHaveBeenCalled();
    expect(inventoryRepository.save).toHaveBeenCalled();
  });

  it('debería lanzar InsufficientStockException si no hay stock suficiente', async () => {
    // 1. ARRANGUE: Solo hay 2 unidades y pedimos 5
    const mockOrder = new WorkOrder({
      id: 'order-1',
      status: WorkOrderStatus.RECEIVED,
      clientId: 'c1',
      equipmentType: 'PC',
      brand: 'Dell',
      model: 'XPS 15',
      reportedFailure: 'SSD issue',
    });
    const mockItem = new InventoryItem({
      sku: 'SSD-480',
      nameKey: 'SSD',
      stock: 2,
      unitPrice: 30,
      minStockAlert: 1,
    });

    orderRepository.findById.mockResolvedValue(mockOrder);
    inventoryRepository.findBySku.mockResolvedValue(mockItem);

    // 2. ACT & ASSERT
    await expect(
      useCase.execute({ orderId: 'order-1', partId: 'SSD-480', quantity: 5 }),
    ).rejects.toThrow(InsufficientStockException);

    // Verificamos que NO se haya guardado nada en la DB
    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(inventoryRepository.save).not.toHaveBeenCalled();
  });
});
