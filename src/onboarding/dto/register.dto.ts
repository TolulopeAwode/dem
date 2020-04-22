import { IsNotEmpty, IsEmail, MaxLength } from "class-validator"

export class RegisterDto {
    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(4)
    verificationCode: string

    @IsNotEmpty()
    password: string
}
