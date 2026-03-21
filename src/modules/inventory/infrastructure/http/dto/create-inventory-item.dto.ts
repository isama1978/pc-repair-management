import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nameKey: string; // Clave única para internacionalización

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string; // SKU único para identificar el inventario

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string; // Categoría del inventario (ej. 'hardware', 'software')

  @IsNumber()
  @IsNotEmpty()
  stock: number; // Stock actual

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  unitPrice: number; // Precio unitario

  @IsNumber()
  @IsOptional()
  minStockAlert?: number; // Stock mínimo para alertar (por defecto 2)
}
