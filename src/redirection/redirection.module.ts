import { Module } from '@nestjs/common';
import { RedirectionController } from './redirection.controller';
import { UsersService } from 'src/users/users.service';
import { LinksModule } from 'src/links/links.module';

@Module({
  imports: [LinksModule],
  controllers: [RedirectionController]
})
export class RedirectionModule { }
