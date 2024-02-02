import { Controller, Get, Param, Redirect, Res } from '@nestjs/common';
import { LinksService } from 'src/links/links.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('Redirection')
export class RedirectionController {
    constructor(private readonly linksService: LinksService) { }

    @Get(':shortUrl')
    async redirectToOriginUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<void> {
        return await this.linksService.redirectToOriginUrl(shortUrl, res);
    }
}
