// src/modules/inventory/domain/exceptions/insufficient-stock.exception.ts
import { DomainException } from '../../../common/domain/exceptions/domain-exception';

export class InsufficientStockException extends DomainException {
  constructor(sku: string, current: number, requested: number) {
    // Pasamos la clave y un objeto con las variables para el JSON
    super('INSUFFICIENT_STOCK', 400, { sku, current, requested });
    this.name = 'InsufficientStockException';
  }
}
