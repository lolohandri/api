import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateLinkDto {
    @ApiProperty()
    @IsUrl()
    @IsNotEmpty()
    originUrl: string;
}
