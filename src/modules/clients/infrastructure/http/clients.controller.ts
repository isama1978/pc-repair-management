import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateClientUseCase } from '../../application/create-client.use-case';
import { CreateClientDto } from './dto/create-client-dto';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FindClientByDniUseCase } from '../../application/find-client-by-dni.use-case';
import { FindClientByNameUseCase } from '../../application/find-client-by-name.use-case';
import { UpdateClientDto } from './dto/update-client-dto';
import { UpdateClientUseCase } from '../../application/update-client.use-case';

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly findClientByDniUseCase: FindClientByDniUseCase,
    private readonly findClientByNameUseCase: FindClientByNameUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
  ) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto, @Res() res: Response) {
    try {
      const createdClient = await this.createClientUseCase.execute(
        createClientDto.fullname,
        createClientDto.phone,
        createClientDto.email,
        createClientDto.address,
        createClientDto.notes,
        createClientDto.dni,
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Client created successfully',
        client: createdClient,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('dni/:dni')
  async findByDni(@Param('dni') dni: string, @Res() res: Response) {
    try {
      const client = await this.findClientByDniUseCase.execute(dni);
      return res.status(HttpStatus.OK).json({
        message: 'Client found successfully',
        client,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Get('name/:name')
  async searchByName(@Param('name') name: string, @Res() res: Response) {
    try {
      const clients = await this.findClientByNameUseCase.execute(name);
      return res.status(HttpStatus.OK).json({
        message: 'Clients found successfully',
        clients,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Patch('id/:id')
  async updateById(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Res() res: Response,
  ) {
    try {
      const updatedClient = await this.updateClientUseCase.execute(
        id,
        updateClientDto,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Client updated successfully',
        client: updatedClient,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
}
