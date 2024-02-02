import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";
import {Role} from "../../utils/enums/role.enum";

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 20, { message: 'Username should be greater than 6 and less than 20!' })
    username: string;

    @ApiProperty()
    @Length(6, 15, { message: 'Password should be greater than 6 and less than 15!' })
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    role: Role;
}