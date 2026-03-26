// src/modules/inventory/domain/inventory-item.entity.ts

import { InvalidDomainValueException } from 'src/modules/common/domain/exceptions/InvalidDomainValueException';
import { InsufficientStockException } from './exceptions/insufficient-stock.exception';

export interface InventoryProps {
  id?: string;
  sku: string;
  nameKey: string;
  category?: string;
  stock: number;
  unitPrice: number;
  minStockAlert: number;
  updatedAt?: Date;
}

interface UpdateInventoryProps {
  sku?: string;
  nameKey?: string;
  category?: string;
  stock?: number;
  unitPrice?: number;
  minStockAlert?: number;
  updatedAt?: Date;
}

export class InventoryItem {
  private props: InventoryProps;

  constructor(props: InventoryProps) {
    // 🛡️ Validaciones iniciales con llaves i18n
    if (props.stock < 0) {
      throw new InvalidDomainValueException('STOCK_CANNOT_BE_NEGATIVE');
    }
    if (props.unitPrice < 0) {
      throw new InvalidDomainValueException('PRICE_CANNOT_BE_NEGATIVE');
    }

    this.props = { ...props };
  }

  // GETTERS (Lectura segura intacta)
  get id() {
    return this.props.id;
  }
  get sku() {
    return this.props.sku;
  }
  get nameKey() {
    return this.props.nameKey;
  }
  get category() {
    return this.props.category;
  }
  get stock() {
    return this.props.stock;
  }
  get unitPrice() {
    return this.props.unitPrice;
  }
  get minStockAlert() {
    return this.props.minStockAlert;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  // Lógica de Stock
  public addStock(quantity: number): void {
    this.props.stock += quantity;
    this.props.updatedAt = new Date();
  }

  public decreaseStock(quantity: number): void {
    if (this.props.stock < quantity) {
      console.log(
        'InsufficientStockException',
        this.props.sku,
        this.props.stock,
        quantity,
      );
      throw new InsufficientStockException(
        this.props.sku,
        this.props.stock,
        quantity,
      );
    }
    this.props.stock -= quantity;
    this.props.updatedAt = new Date();
  }

  public isLowStock(): boolean {
    return this.props.stock <= this.props.minStockAlert;
  }

  /**
   * Actualización segura de campos.
   * Mantiene las reglas de negocio y actualiza la fecha automáticamente.
   */
  public update(props: UpdateInventoryProps): void {
    // 1. Validaciones de negocio en la actualización
    if (props.unitPrice !== undefined && props.unitPrice < 0) {
      throw new InvalidDomainValueException('PRICE_CANNOT_BE_NEGATIVE');
    }

    if (props.stock !== undefined && props.stock < 0) {
      throw new InvalidDomainValueException('STOCK_CANNOT_BE_NEGATIVE');
    }

    // 2. SAFE MERGE (Sin perder nada)
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'id') return; // El ID es inmutable
      if (value !== undefined) {
        (this.props as any)[key] = value;
      }
    });

    // 3. Marca de tiempo automática
    this.props.updatedAt = new Date();
  }
}
