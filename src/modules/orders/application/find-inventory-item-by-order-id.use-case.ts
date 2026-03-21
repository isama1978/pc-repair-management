import { Injectable } from '@nestjs/common';
import { OrderPartsRepository } from 'src/modules/orders/domain/order-parts.repository';

@Injectable()
export class FindInventoryItemsByOrderIdUseCase {
  constructor(private readonly orderPartsRepo: OrderPartsRepository) {}

  async execute(orderId: string) {
    // Este método devuelve las instancias de OrderPart (con precio snapshot y nombre)
    return await this.orderPartsRepo.findByOrderId(orderId);
  }
}
