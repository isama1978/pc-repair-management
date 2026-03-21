import { Client } from './client.entity';

export abstract class ClientRepository {
  abstract save(client: Client): Promise<Client>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByDni(dni: string): Promise<Client | null>;
  abstract findAll(): Promise<Client[]>;
  abstract update(client: Client): Promise<void>;
  // Nuevo método para buscar clientes por nombre
  abstract searchByName(name: string): Promise<Client[]>;
}
export const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';
