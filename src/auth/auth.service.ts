import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/entity/user/user.entity';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {Payload} from '../utils/types/payload';
import {JwtService} from '@nestjs/jwt';
import {Role} from "../utils/enums/role.enum";
import {RegisterDto} from "./dto/registerDto";
import {LoginDto} from "./dto/loginDto";
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthService {
    private readonly salt: number = 10;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) {
    }

    async getTokens(userId: string, username: string, role: Role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                    sub: userId,
                    username: username,
                    role: role,
                },
                {
                    secret: process.env.ACCESS_TOKEN_SECRET,
                    expiresIn: 60 * 120,
                }),
            this.jwtService.signAsync({
                    sub: userId,
                    username: username,
                    role: role,
                },
                {
                    secret: process.env.REFRESH_TOKEN_SECRET,
                    expiresIn: 60 * 60 * 24 * 7,
                })
        ]);

        return {
            accessToken,
            refreshToken
        };
    }

    async register(dto: RegisterDto): Promise<Payload> {
        const user = await this.userService.getUserByUsername(dto.username);
        if (user) {
            throw new BadRequestException(`User '${dto.username}' already exists!`);
        }

        const password = await bcrypt.hash(dto.password, this.salt);
        const newUser = await this.userRepository.save({username: dto.username, passwordHash: password});
        const tokens = await this.getTokens(newUser.id, newUser.username, newUser.role);

        await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);

        const {passwordHash, hashedRefreshToken, ...rest} = user;
        return {
            ...rest,
            ...tokens
        };
    }

    async login(dto: LoginDto): Promise<Payload> {
        const user = await this.userService.getUserByUsername(dto.username);
        if (!user) {
            throw new BadRequestException('Invalid username or password has been provided!');
        }

        const isPasswordMatches = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordMatches) {
            throw new BadRequestException('Invalid username or password has been provided!');
        }

        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

        const {passwordHash, hashedRefreshToken, ...rest} = user;
        return {
            ...rest,
            ...tokens
        };
    }

    async updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
        const hash = await bcrypt.hash(refreshToken, this.salt);
        await this.userRepository.update(userId, {hashedRefreshToken: hash});
    }

    async logOut(userId: string): Promise<void> {
        await this.userRepository.update(userId, {
            hashedRefreshToken: null
        });
    }

    async refreshToken(userId: string, refreshToken: string): Promise<Payload> {
        const user = await this.userService.getUserById(userId);
        const isRefreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isRefreshTokenMatches) throw new BadRequestException(`Refresh token doesn't match!`);

        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

        const {passwordHash, hashedRefreshToken, ...rest} = user;
        return {
            ...rest,
            ...tokens
        };
    }
}
