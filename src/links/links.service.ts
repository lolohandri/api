import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions, FindOptions, Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { ShortLink } from 'src/utils/short-link.interface';
import { ShortLinkImpl } from 'src/utils/short-link-impl';

@Injectable()
export class LinksService {
  shortLink: ShortLink = new ShortLinkImpl();
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) { }

  async create(createLinkDto: CreateLinkDto): Promise<Link> {
    if (this.linksRepository.find({ where: { originUrl: createLinkDto.originUrl } })) {
      throw new HttpException(`Url already exists in database!`, HttpStatus.BAD_REQUEST);
    }
    const linkToReturn = {
      originUrl: createLinkDto.originUrl,
      shortUrl: this.shortLink.getShortLink(8)
    }
    return await this.linksRepository.save(linkToReturn);
  }

  async getAll(): Promise<Link[]> {
    return await this.linksRepository.find();
  }

  async get(id: string): Promise<Link> {
    return await this.linksRepository.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.linksRepository.delete(id);
  }

  async getLink(condition: string): Promise<Link> {
    return await this.linksRepository.findOne({ where: { shortUrl: `${condition}` } });
  }
}
