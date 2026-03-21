import { Module } from '@nestjs/common';
import { TypeOrmClientRepository } from './infrastructure/persistence/typeorm-client.repository';
import { CreateClientUseCase } from './application/create-client.use-case';
import { ClientController } from './infrastructure/http/clients.controller';
import { ClientOrmEntity } from './infrastructure/persistence/client.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindClientByDniUseCase } from './application/find-client-by-dni.use-case';
import { FindClientByNameUseCase } from './application/find-client-by-name.use-case';
import { UpdateClientUseCase } from './application/update-client.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  controllers: [ClientController],
  providers: [
    CreateClientUseCase,
    FindClientByDniUseCase,
    FindClientByNameUseCase,
    UpdateClientUseCase,
    {
      provide: 'CLIENT_REPOSITORY',
      useClass: TypeOrmClientRepository,
    },
  ],
})
export class ClientsModule {}
