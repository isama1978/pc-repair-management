import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../../domain/client.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ClientOrmEntity } from './client.orm-entity';
import { Client } from '../../domain/client.entity';

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly clientRepository: Repository<ClientOrmEntity>,
  ) {}

  async save(client: Client): Promise<Client> {
    const ormEntity = this.clientRepository.create({
      fullname: client.fullname,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes,
      dni: client.dni,
    });
    const saved = await this.clientRepository.save(ormEntity);
    return new Client(
      saved.id,
      saved.fullname,
      saved.phone,
      saved.email,
      saved.address,
      saved.notes,
      saved.dni,
    );
  }

  async findById(id: string): Promise<Client | null> {
    const ormEntity = await this.clientRepository.findOne({
      where: { id },
    });
    if (!ormEntity) {
      return null;
    }
    return new Client(
      ormEntity.id,
      ormEntity.fullname,
      ormEntity.phone,
      ormEntity.email,
      ormEntity.address,
      ormEntity.notes,
      ormEntity.dni,
    );
  }

  async findByDni(dni: string): Promise<Client | null> {
    const ormEntity = await this.clientRepository.findOne({
      where: { dni },
    });
    if (!ormEntity) {
      return null;
    }
    return new Client(
      ormEntity.id,
      ormEntity.fullname,
      ormEntity.phone,
      ormEntity.email,
      ormEntity.address,
      ormEntity.notes,
      ormEntity.dni,
    );
  }

  async searchByName(name: string): Promise<Client[]> {
    const ormEntities = await this.clientRepository.find({
      where: {
        fullname: Like(`%${name}%`),
      },
    });
    if (!ormEntities || ormEntities.length === 0) {
      return [];
    }
    return ormEntities.map(
      (ormEntity) =>
        new Client(
          ormEntity.id,
          ormEntity.fullname,
          ormEntity.phone,
          ormEntity.email,
          ormEntity.address,
          ormEntity.notes,
          ormEntity.dni,
        ),
    );
  }

  async findAll(): Promise<Client[]> {
    const ormEntities = await this.clientRepository.find();
    return ormEntities.map(
      (ormEntity) =>
        new Client(
          ormEntity.id,
          ormEntity.fullname,
          ormEntity.phone,
          ormEntity.email,
          ormEntity.address,
          ormEntity.notes,
          ormEntity.dni,
        ),
    );
  }

  async update(client: Client): Promise<void> {
    await this.clientRepository.update(client.id || '', {
      fullname: client.fullname,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes,
      dni: client.dni,
    });
  }
}
