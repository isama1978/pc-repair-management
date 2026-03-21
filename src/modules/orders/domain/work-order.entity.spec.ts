/* WORK ORDER UNIT TESTS
  Ensures business rules are enforced at the domain level.
*/

import { WorkOrder, WorkOrderStatus } from './work-order.entity';

describe('WorkOrder Entity', () => {
  it('should create a valid work order with default status RECEIVED', () => {
    const order = new WorkOrder({
      clientId: '123e4567-e89b-12d3-a456-426614174000', // <--- Añadido
      equipmentType: 'Laptop',
      brand: 'Dell',
      model: 'Latitude',
      reportedFailure: 'Not turning on',
    });

    expect(order.brand).toBe('Dell');
    expect(order.status).toBe(WorkOrderStatus.RECEIVED);
  });

  it('should throw an error if brand is missing', () => {
    expect(() => {
      new WorkOrder({
        clientId: '123e4567-e89b-12d3-a456-426614174000', // <--- Añadido
        equipmentType: 'Laptop',
        brand: '', // Empty brand
        model: 'Latitude',
        reportedFailure: 'Broken screen',
      });
    }).toThrow('EQUIPMENT_BRAND_REQUIRED');
  });
});
