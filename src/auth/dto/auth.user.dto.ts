import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class AuthDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 20, { message: 'Username should be greater than 6 and less than 20!' })
    username: string;

    @ApiProperty()
    @Length(6, 15, { message: 'Password should be greater than 6 and less than 20!' })
    @IsNotEmpty()
    password: string;
}