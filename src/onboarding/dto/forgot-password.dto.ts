import { IsNotEmpty, IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}

export class HelloInput {
    @IsNotEmpty()
    name: string
}
export class HelloResponse {
    message: string
}
