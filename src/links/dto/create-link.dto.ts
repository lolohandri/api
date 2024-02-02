import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateLinkDto {
    @ApiProperty()
    @IsUrl( {}, {message: 'Wrong url has been provided!'})
    @IsNotEmpty()
    originUrl: string;
}
