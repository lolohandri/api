import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { ApiTags } from '@nestjs/swagger';
import { Link } from './entities/link.entity';
import { DeleteResult } from 'typeorm';

@Controller('links')
@ApiTags('Links')
export class LinksController {
  constructor(private readonly linksService: LinksService) { }

  @Post()
  async create(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  async getAll(): Promise<Link[]> {
    return this.linksService.getAll();
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Link> {
    return this.linksService.get(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.linksService.remove(id);
  }
}
