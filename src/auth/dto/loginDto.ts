import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, Length} from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}