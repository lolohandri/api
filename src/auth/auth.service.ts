import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.user.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    readonly salt: number = 10;
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async getTokens(userId: string, username: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username: username,
            },
                {
                    secret: 'access-token-secret',
                    expiresIn: 60 * 15,
                }),
            this.jwtService.signAsync({
                sub: userId,
                username: username,
            },
                {
                    secret: 'refresh-token-secret',
                    expiresIn: 60 * 60 * 24 * 7,
                })
        ]);

        return {
            accessToken: at,
            refreshToken: rt
        };
    }

    async signUp(dto: AuthDto): Promise<Tokens> {
        const user = await this.userRepository.findOne({ where: { username: dto.username } });
        if (user) {
            throw new HttpException(`User with username:'${dto.username}' already exists!`, HttpStatus.BAD_REQUEST);
        }

        const hash = await bcrypt.hash(dto.password, this.salt);
        const newUser = await this.userRepository.save({ username: dto.username, passswordHash: hash });
        const tokens = await this.getTokens(newUser.id, newUser.username);

        await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
        console.log(tokens.refreshToken);
        return tokens;
    }

    async signIn(dto: AuthDto): Promise<Tokens> {
        const user = await this.userRepository.findOne({ where: { username: dto.username } });
        if (!user) {
            throw new HttpException('Invalid username or password has been provided!', HttpStatus.BAD_REQUEST);
        }

        const isPasswordMatches = await bcrypt.compare(dto.password, user.passswordHash);
        if (!isPasswordMatches) {
            throw new HttpException('Invalid username or password has been provided!', HttpStatus.BAD_REQUEST);
        }

        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }

    async updateRefreshTokenHash(userId: string, rt: string): Promise<void> {
        const hash = await bcrypt.hash(rt, this.salt);
        await this.userRepository.update(userId, { hashedRefreshToken: hash });
    }

    async logOut(userId: string): Promise<void> {
        await this.userRepository.update(userId, {
            hashedRefreshToken: null
        });
    }

    async refreshTokens(userId: string, rt: string): Promise<Tokens> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new HttpException(`User doesn't exist!`, HttpStatus.BAD_REQUEST);

        const rtMatches = bcrypt.compare(rt, user.hashedRefreshToken);
        if (!rtMatches) throw new HttpException(`Refresh token doesn't match!`, HttpStatus.BAD_REQUEST);

        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
        return tokens;
    }
}
