import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsOptional() // Opcional porque el ID es lo que manda, pero útil para logueo
  clientName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  equipmentType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  brand: string;

  @IsString()
  @IsOptional() // En SQL permites NULL en model
  @MaxLength(50)
  model: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  serialNumber?: string; // Nuevo: Clave para identificar el equipo único

  @IsString()
  @IsOptional()
  aestheticCondition?: string; // Nuevo: ¿Viene rayado? ¿Le falta un tornillo?

  @IsString()
  @IsNotEmpty()
  reportedFailure: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  laborCost?: number; // Costo de mano de obra inicial (presupuesto)

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  totalAmount?: number; // Monto total (puede ser igual al laborCost inicialmente)

  @IsString()
  @IsOptional()
  notes?: string; // Nota inicial para el historial

  @IsString()
  @IsOptional()
  deliveryDate?: Date; // Fecha de entrega prevista
}
