import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateOrderPartDto {
  @IsUUID()
  @IsNotEmpty()
  partId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
