import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity()
export class Otp extends BaseEntity {

    @Column({ unique: true, primary: true })
    recipient: string

    @Column({ length: 4 })
    code: string
}
