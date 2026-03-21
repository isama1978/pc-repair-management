import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../domain/client.repository';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';

@Injectable()
export class FindClientByDniUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(dni: string): Promise<Client> {
    const client = await this.clientRepository.findByDni(dni);

    // Si no existe, lanzamos un error 404 amigable
    if (!client) {
      throw new NotFoundException(
        `No se encontró ningún cliente con el DNI: ${dni}`,
      );
    }

    return client;
  }
}
