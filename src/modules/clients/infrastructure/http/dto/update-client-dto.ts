import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsNotEmpty()
  dni: string;
}
