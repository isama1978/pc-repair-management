import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { WorkOrderStatus } from '../../../domain/work-order.entity';

export class UpdateOrderDto {
  @IsEnum(WorkOrderStatus, {
    message: 'The status provided is not valid for a repair order.',
  })
  @IsOptional()
  status?: WorkOrderStatus;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Note must be at least 5 characters long' })
  notes: string;

  @IsString()
  @IsOptional()
  deliveryDate?: Date; // Fecha de entrega prevista

  @IsNumber()
  @IsOptional()
  laborCost?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  technicalDiagnosis?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  aestheticCondition?: string;
}
