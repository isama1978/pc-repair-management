import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './modules/orders/orders.module';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path'; // <--- Añade esto
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { InventoryModule } from './modules/inventory/inventory.module';

console.log('📂 I18n Path:', path.join(__dirname, '..', 'i18n'));
@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configure Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        ssl: configService.get<boolean>('DB_SSL'),
        autoLoadEntities: true,
        synchronize: false, // Set to false to protect our manual DDL scripts
        logging: false,
        entities: [path.join(__dirname, '**/*.orm-entity{.ts,.js}')],
        migrations: [path.join(__dirname, 'migrations/**/*{.ts,.js}')],
        migrationsRun: true,
        cli: {
          migrationsDir: 'src/migrations',
        },
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    // I18n Configuration (Internationalization)
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..', 'i18n'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang']), // Look for lang in headers
        new QueryResolver(['lang', 'l']), // Look for lang in URL (?lang=es)
        AcceptLanguageResolver, // Look for browser language
      ],
    }),
    // Import other modules
    OrdersModule,
    AuthModule,
    ClientsModule,
    InventoryModule,
  ],
})
export class AppModule {}
