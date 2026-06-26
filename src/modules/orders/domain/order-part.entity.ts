// src/modules/orders/domain/order-part.entity.ts

import { InvalidDomainValueException } from '../../common/domain/exceptions/InvalidDomainValueException';

export interface OrderPartProps {
  id?: string;
  orderId: string;
  partId: string;
  quantity: number;
  priceAtSnapshot: number; // El precio que tenía el repuesto al momento del uso
  subtotal?: number; // Opcional: para mostrar en el historial sin hacer un JOIN extra
  partName?: string; // Opcional: para mostrar en el historial sin hacer un JOIN extra
}

export class OrderPart {
  constructor(private readonly props: OrderPartProps) {
    if (props.quantity <= 0)
      throw new InvalidDomainValueException('La cantidad debe ser mayor que 0');
  }

  get id() {
    return this.props.id;
  }
  get orderId() {
    return this.props.orderId;
  }
  get partId() {
    return this.props.partId;
  }
  get quantity() {
    return this.props.quantity;
  }
  get priceAtSnapshot() {
    return this.props.priceAtSnapshot;
  }
  // En el getter de la clase OrderPart
  get subtotal() {
    // Si no viene en props, lo calculamos al vuelo
    return (
      this.props.subtotal || this.props.quantity * this.props.priceAtSnapshot
    );
  }
  get partName() {
    return this.props.partName;
  }
}
