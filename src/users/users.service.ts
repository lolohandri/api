import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async getUsers(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { username: username } });
    }
    async getUserById(id: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { id: id } });
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.usersRepository.delete(id);
    }
    async deleteAll(): Promise<void> {
        return await this.usersRepository.clear();
    }
}
