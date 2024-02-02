import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions, FindOptions, Repository } from 'typeorm';
import { Link } from '../entity/link/link.entity';
import { ShortLinkImpl } from 'src/utils/shortener/short-link-impl';
import { Response } from 'express';
import { IShortLink } from 'src/utils/shortener/short-link.interface';
import {isUUID} from "class-validator";

@Injectable()
export class LinksService {
  private readonly shortLink: IShortLink = new ShortLinkImpl();
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  async create(createLinkDto: CreateLinkDto, username: string): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: { originUrl: createLinkDto.originUrl } });
    if (link) {
      throw new BadRequestException(`Url already exists!`);
    }
    const newLink = {
      originUrl: createLinkDto.originUrl,
      shortUrl: this.shortLink.getShortLink(8),
      createdBy: username
    }
    return await this.linksRepository.save(newLink);
  }

  async getAll(): Promise<Link[]> {
    return await this.linksRepository.find();
  }

  async get(id: string): Promise<Link> {
    return await this.linksRepository.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<DeleteResult> {
    if(!isUUID(id)) throw new BadRequestException("Invalid 'id' has been provided!");
    return await this.linksRepository.delete(id);
  }

  async redirectToOriginUrl(shortLink: string, res: Response): Promise<void> {
    const link = await this.linksRepository.findOne({ where: { shortUrl: `${shortLink}` } });
    if (!link?.originUrl) throw new BadRequestException('Invalid url has been provided!');
    return res.redirect(301, link.originUrl);
  }
}
