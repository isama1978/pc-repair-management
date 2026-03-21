// src/modules/orders/domain/order-parts.repository.ts
import { OrderPart } from './order-part.entity';

export abstract class OrderPartsRepository {
  // Añadir un repuesto a la orden
  abstract addPart(orderPart: OrderPart): Promise<void>;

  // Listar todos los repuestos que tiene una orden específica
  abstract findByOrderId(orderId: string): Promise<OrderPart[]>;

  // Quitar un repuesto de una orden (por si el técnico se equivoca)
  abstract removePart(orderPartId: string): Promise<void>;

  // Calcular la suma de todos los sub-totales de una orden
  abstract sumTotalByOrderId(orderId: string): Promise<number>;
}

export const ORDER_PARTS_REPOSITORY = 'ORDER_PARTS_REPOSITORY';
