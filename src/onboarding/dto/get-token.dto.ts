import { IsNotEmpty, IsEmail } from "class-validator"

export class GetTokenDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}