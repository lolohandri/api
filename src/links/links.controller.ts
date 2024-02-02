import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {LinksService} from './links.service';
import {CreateLinkDto} from './dto/create-link.dto';
import {ApiBadRequestResponse, ApiOkResponse, ApiResponse, ApiSecurity, ApiTags} from '@nestjs/swagger';
import {Link} from '../entity/link/link.entity';
import {DeleteResult} from 'typeorm';
import {Roles} from 'src/common/decorators/roles.decorator';
import {Role} from 'src/utils/enums/role.enum';
import {RoleGuard} from "../common/guards/role.guard";
import {Public} from "../common/decorators/public.decorator";
import {User} from "../entity/user/user.entity";
import {GetCurrentUser} from "../common/decorators/get-current-user.decorator";

@Controller('links')
@ApiTags('Links')
@UseGuards(RoleGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {
  }

  @ApiSecurity("JWT Auth")
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() createLinkDto: CreateLinkDto, @GetCurrentUser('username') username: string): Promise<Link> {
    return await this.linksService.create(createLinkDto, username);
  }

  @Public()
  @Get()
  @ApiOkResponse({
    status: 200,
    description: 'Array of links in the database',
    schema: {
      example:
        [
          {
            id: 'uuid1',
            originUrl: 'http//localhost:3000/example1',
            shortUrl: 'random string1',
            date: new Date()
          },
          {
            id: 'uuid2',
            originUrl: 'http//localhost:3000/example2',
            shortUrl: 'random string2',
            date: new Date()
          },
          {
            next:'and so on'
          }
        ]
    }
  })
  async getAll(): Promise<Link[]> {
    return await this.linksService.getAll();
  }

  @Public()
  @Get(':id')
  async get(@Param('id') id: string): Promise<Link> {
    return await this.linksService.get(id);
  }

  @ApiSecurity("JWT Auth")
  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  @ApiOkResponse({
    status: 200,
    description: 'Successfully deleted data from the database',
    type: DeleteResult,
    schema: {
      example:
        [
          {
            id: 'uuid1',
            originUrl: 'http//localhost:3000/example1',
            shortUrl: 'random string1',
            date: Date.now()
          },
          {
            id: 'uuid2',
            originUrl: 'http//localhost:3000/example2',
            shortUrl: 'random string2',
            date: Date.now()
          }
        ]
    }
  })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.linksService.remove(id);
  }
}
