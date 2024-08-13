import { Module } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtAuthenticationGuard } from '../jwt/jwt-authentication.guard';
import { AuthenticationResolver } from './authentication.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthenticationService,
    AuthenticationResolver,
    JwtStrategy,
    JwtAuthenticationGuard,
  ],
  exports: [JwtAuthenticationGuard, TypeOrmModule],
})
export class AuthenticationGraphQlModule {}
