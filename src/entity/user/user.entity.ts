import { Role } from "src/utils/enums/role.enum";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity('users')
export class User extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({ unique: true })
    username: string;

    @ApiProperty()
    @Column()
    passwordHash: string;

    @ApiProperty()
    @Column({ nullable: true })
    hashedRefreshToken: string;

    @ApiProperty()
    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER,
        nullable: false
    })
    role: Role;
}