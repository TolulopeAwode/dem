import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    password: string

    @Column()
    salt: string
}