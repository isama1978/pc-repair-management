import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../domain/client.repository';
import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';

@Injectable()
export class FindClientByNameUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(name: string): Promise<Client[]> {
    const clients = await this.clientRepository.searchByName(name);
    if (!clients || clients.length === 0) {
      throw new NotFoundException(
        `No clients found with name containing ${name}`,
      );
    }
    return clients;
  }
}
