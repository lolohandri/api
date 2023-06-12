import { BadRequestException, Controller, Get, Param, Redirect, Res } from '@nestjs/common';
import { LinksService } from 'src/links/links.service';
import * as express from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Redirection')
export class RedirectionController {

    constructor(private readonly linksService: LinksService) { }

    @Get('/:shortLink')
    @Redirect()
    async getOriginByShortLink(@Param('shortLink') shortLink: string, @Res() res: express.Response): Promise<void> {
        const link = await this.linksService.getLink(shortLink);
        if (!link?.originUrl) throw new BadRequestException('Invalid url');

        return res.redirect(301, link.originUrl);
    }
}
