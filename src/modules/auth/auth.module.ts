import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/http/auth.controller';
import { AuthService } from './application/auth.service';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './application/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '8h' }, // Technician login once per shift
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
