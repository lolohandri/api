import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { Observable } from 'rxjs';
import { User } from '../entity/user/user.entity';
import {Roles} from "../common/decorators/roles.decorator";
import {Role} from "../utils/enums/role.enum";

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  // @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersService.deleteUser(id);
  }

  @Delete()
  async deleteAll(): Promise<void> {
    return await this.usersService.deleteAll();
  }
}
