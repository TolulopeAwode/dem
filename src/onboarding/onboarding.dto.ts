import { IsNotEmpty, IsEmail, MaxLength } from "class-validator";






export class ProfileDto {
    email: string
    firstName: string
    lastName: string
}
