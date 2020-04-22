import { IsNotEmpty, IsEmail, MaxLength } from "class-validator"

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(4)
    verificationCode: string

    @IsNotEmpty()
    password: string
}