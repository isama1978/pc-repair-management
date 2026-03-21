import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderPartsRepository } from '../../domain/order-parts.repository';
import { OrderPart } from '../../domain/order-part.entity';
import { OrderPartOrmEntity } from './order-part.orm-entity';

@Injectable()
export class TypeOrmOrderPartsRepository implements OrderPartsRepository {
  constructor(
    @InjectRepository(OrderPartOrmEntity)
    private readonly repository: Repository<OrderPartOrmEntity>,
  ) {}

  async addPart(orderPart: OrderPart): Promise<void> {
    const ormEntity = this.repository.create({
      orderId: orderPart.orderId,
      partId: orderPart.partId,
      quantity: orderPart.quantity,
      priceAtSnapshot: orderPart.priceAtSnapshot,
    });

    await this.repository.save(ormEntity);
  }

  async findByOrderId(orderId: string): Promise<OrderPart[]> {
    const parts = await this.repository.find({
      where: { orderId },
      relations: ['part'], // Traemos la relación con inventario para el nombre
    });

    return parts.map((orm) => this.toDomain(orm));
  }

  async removePart(orderPartId: string): Promise<void> {
    await this.repository.delete(orderPartId);
  }

  /**
   * Este método es clave: calcula el costo total de repuestos
   * directamente en la base de datos (más eficiente que hacerlo en JS)
   */
  async sumTotalByOrderId(orderId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('op')
      .select('SUM(op.quantity * op.price_at_snapshot)', 'total')
      .where('op.order_id = :orderId', { orderId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  private toDomain(orm: OrderPartOrmEntity): OrderPart {
    return new OrderPart({
      id: orm.id,
      orderId: orm.orderId,
      partId: orm.partId,
      quantity: orm.quantity,
      priceAtSnapshot: orm.priceAtSnapshot,
      partName: orm.part?.nameKey, // Cargamos el nombre desde la relación
      subtotal: orm.quantity * orm.priceAtSnapshot,
    });
  }
}
