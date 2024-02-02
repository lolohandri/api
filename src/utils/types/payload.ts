import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../enums/role.enum";

export class Payload {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    role: Role;
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}