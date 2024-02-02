import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('links')
export class Link extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    originUrl: string;

    @Column()
    shortUrl: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({nullable: false})
    createdBy: string;
}
