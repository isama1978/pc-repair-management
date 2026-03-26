import { InventoryItem } from './inventory-item.entity';
import { InvalidDomainValueException } from 'src/modules/common/domain/exceptions/InvalidDomainValueException';

describe('InventoryItem Entity', () => {
  it('should throw an error if stock is negative', () => {
    const props = {
      sku: 'TEST-01',
      nameKey: 'Test Item',
      stock: -1, // ❌
      unitPrice: 100,
      minStockAlert: 5,
    };

    expect(() => new InventoryItem(props)).toThrow(InvalidDomainValueException);
  });

  it('should detect low stock correctly', () => {
    const item = new InventoryItem({
      sku: 'TEST-01',
      nameKey: 'Test',
      stock: 5,
      unitPrice: 10,
      minStockAlert: 5,
    });

    expect(item.isLowStock()).toBe(true);
  });
});
