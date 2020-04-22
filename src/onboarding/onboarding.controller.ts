import { Controller, Post, UseGuards, ValidationPipe, Body, UsePipes, Param, UseFilters } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendVerifyEmailCodeDto } from './dto/send-verify-email-code.dto';
import {
    SendVerifyEmailCodeCommand, RegisterCommand,
    ForgotPasswordCommand, ResetPasswordCommand, GetTokenCommand
} from './onboarding.commands';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { ForgotPasswordDto, HelloResponse, HelloInput } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GetTokenDto } from './dto/get-token.dto';
import { VerifyCodeCommand } from 'src/otp/otp.commands';
import { CustomException } from './exceptions/custom.exception';

@Controller("api/auth")
//@UseFilters(CustomExceptionFilter)
export class OnboardingController {

    constructor(private commandBus: CommandBus) {
    }

    @Post("sendVerificationEmail")
    @UsePipes(ValidationPipe)
    async  sendVerificationEmail(@Body() model: SendVerifyEmailCodeDto) {
        await this.commandBus.execute(new SendVerifyEmailCodeCommand(model.email))
    }

    @Post("verifyEmail")
    @UsePipes(ValidationPipe)
    async verifyEmail(@Body() model: VerifyEmailDto) {
        var otpIsValid = await this.commandBus.execute(new VerifyCodeCommand(model.email, model.verificationCode));
        if (!otpIsValid)
            throw new CustomException("Invalid verification code.")
    }

    @Post("register")
    @UsePipes(ValidationPipe)
    async register(@Body() model: RegisterDto): Promise<TokenResponseDto> {
        return await this.commandBus.execute(new RegisterCommand(model.firstName,
            model.lastName, model.email, model.verificationCode, model.password))
    }

    @Post("forgotPassword")
    @UsePipes(ValidationPipe)
    async forgotPassword(model: ForgotPasswordDto) {
        await this.commandBus.execute(new ForgotPasswordCommand(model.email))
    }

    @Post("resetPassword")
    @UsePipes(ValidationPipe)
    async resetPassword(@Body() model: ResetPasswordDto): Promise<TokenResponseDto> {
        return await this.commandBus.execute(new ResetPasswordCommand(model.email, model.verificationCode, model.password));
    }

    @Post("getToken")
    @UsePipes(ValidationPipe)
    async getToken(@Body() model: GetTokenDto): Promise<TokenResponseDto> {
        return await this.commandBus.execute(new GetTokenCommand(model.email, model.password))
    }
    @Post("hello")
    @UsePipes(ValidationPipe)
    hello(@Body() input: HelloInput): HelloResponse {
        var response = new HelloResponse()
        response.message = `Hello ${input.name} from micro services.`;
        return response;
    }
}
