import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation, ApiResponse,
  ApiSecurity,
  ApiTags, getSchemaPath
} from '@nestjs/swagger';
import {RegisterDto} from './dto/registerDto';
import {AccessTokenGuard} from 'src/common/guards/at.guard';
import {GetCurrentUserId} from 'src/common/decorators/get-current-user-id.decorator';
import {Public} from 'src/common/decorators/public.decorator';
import {LoginDto} from "./dto/loginDto";
import {Link} from "../entity/link/link.entity";
import {User} from "../entity/user/user.entity";
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {Payload} from "../utils/types/payload";

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Identify the user',
    description: 'Endpoint to get {access, refresh} tokens. <br/><br/>' +
      'You need to enter user`s username and password. <br/>' +
      'Username is unique length from 6 to 20, password length from 6 to 15. <br/>' +
      'Use access token to get access to blocked endpoints.'
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<Payload> {
    return await this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @ApiExtraModels(Payload)
  @ApiOperation({
    summary: 'User registration',
    description: 'Endpoint to get {access, refresh}  tokens. <br/><br/>' +
      'You need to enter user`s username and password NOT NULL. <br/>' +
      'Username is unique length from 6 to 20, password length from 6 to 15 NOT NULL. <br/>' +
      'Use access token to get access to blocked endpoints. <br/>' +
      'Role is ADMIN or USER not NULL',
  })
  @ApiCreatedResponse(
    {
      description: 'Returns pair of tokens access and refresh',
      schema: {
        $ref: getSchemaPath(Payload)
      }
    }
  )
  @ApiBadRequestResponse(
    {
      description: 'If user already exists <br/>' +
        'If username or password is not valid',
      schema: {
        example: [
          'User \'...\' already exists!',
          'Length should be greater than x and less than y!. Role is not NULL'
        ]
      }
    }
  )
  @ApiResponse({
    status: 200,
    type: User,
    isArray: true,
    schema: {
      items: {
        type: 'User',
        $ref: getSchemaPath(Link)
      }
    }
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<Payload> {
    return await this.authService.register(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @ApiSecurity('JWT Auth')
  @HttpCode(HttpStatus.OK)
  async logOut(@GetCurrentUserId() userId: string): Promise<void> {
    return await this.authService.logOut(userId);
  }


  @UseGuards(AccessTokenGuard)
  @Post('refresh')
  @ApiSecurity('JWT Auth')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetCurrentUserId() userId: string, @Body() dto: RefreshTokenDto): Promise<Payload> {
    return await this.authService.refreshToken(userId, dto.refreshToken);
  }
}
