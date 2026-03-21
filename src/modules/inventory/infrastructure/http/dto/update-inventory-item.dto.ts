import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryItemDto } from './create-inventory-item.dto';

export class UpdateInventoryItemDto extends PartialType(
  CreateInventoryItemDto,
) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nameKey: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  category: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @IsNumber()
  @IsNotEmpty()
  minStockAlert: number;
}
