import { Global, Module } from '@nestjs/common';
import { RedirectionController } from './redirection.controller';
import { LinksService } from 'src/links/links.service';
import { LinksModule } from 'src/links/links.module';

@Global()
@Module({
    imports: [LinksModule],
    controllers: [RedirectionController],
})
export class RedirectionModule {

}
