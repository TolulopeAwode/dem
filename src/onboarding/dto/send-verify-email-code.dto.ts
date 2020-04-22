import { IsNotEmpty, IsEmail } from "class-validator";

export class SendVerifyEmailCodeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}
