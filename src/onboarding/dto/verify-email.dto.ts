import { IsNotEmpty, IsEmail, MaxLength } from "class-validator"

export class VerifyEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MaxLength(4)
    verificationCode: string
}