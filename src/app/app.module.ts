import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/entity/user/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { LinksModule } from 'src/links/links.module';
import { LinksController } from 'src/links/links.controller';
import { LinksService } from 'src/links/links.service';
import { Link } from 'src/entity/link/link.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/auth/strategies/at.strategy';
import { RefreshTokenStrategy } from 'src/auth/strategies/rt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RedirectionModule } from 'src/redirection/redirection.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || '127.0.0.1',
      port: parseInt(<string>(process.env.POSTGRES_PORT || 3306)),
      username: process.env.POSTGRES_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DATABASE || 'postgres',
      entities: [Link, User],
      synchronize: true
    }),
    AuthModule,
    UsersModule,
    LinksModule,
    PassportModule,
    RedirectionModule,
    JwtModule.register({}),
  ],
  controllers: [
    AuthController,
    UsersController,
    LinksController,
  ],
  providers: [
    AuthService,
    UsersService,
    LinksService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {
}
