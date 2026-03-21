import { Inject, Injectable } from '@nestjs/common';
import { Client } from '../domain/client.entity';
import { CLIENT_REPOSITORY } from '../domain/client.repository';
// 2. Importamos la INTERFAZ (solo como tipo para TypeScript)
import { ClientRepository } from '../domain/client.repository';

@Injectable()
export class CreateClientUseCase {
  constructor(
    // 4. Le decimos a NestJS explícitamente qué inyectar usando el Token
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    fullname: string,
    phone: string,
    email: string,
    address: string,
    notes: string,
    dni: string,
  ): Promise<Client> {
    const client = new Client(
      undefined,
      fullname,
      phone,
      email,
      address,
      notes,
      dni,
    );
    return this.clientRepository.save(client);
  }
}
