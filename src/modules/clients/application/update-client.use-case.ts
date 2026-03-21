import { Inject, Injectable } from '@nestjs/common';
import { Client } from '../domain/client.entity';
import { CLIENT_REPOSITORY } from '../domain/client.repository';
// 2. Importamos la INTERFAZ (solo como tipo para TypeScript)
import { ClientRepository } from '../domain/client.repository';
import { UpdateClientDto } from '../infrastructure/http/dto/update-client-dto';
import { EntityNotFoundException } from 'src/modules/common/domain/exceptions/EntityNotFoundException';

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new EntityNotFoundException('Cliente', id);
    }
    client.update(updateClientDto);
    await this.clientRepository.update(client);
    return client;
  }
}
