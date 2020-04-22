import { Injectable, UsePipes, ValidationPipe, Body, UseFilters } from '@nestjs/common';

import { HelloResponse, HelloInput, ForgotPasswordDto } from './dto/forgot-password.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { CustomExceptionFilter } from './filters/custom.exception.filter';
import { CommandBus } from '@nestjs/cqrs';
import { GetTokenDto } from './dto/get-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { GetTokenCommand, SendVerifyEmailCodeCommand, RegisterCommand, ForgotPasswordCommand, ResetPasswordCommand } from './onboarding.commands';
import { SendVerifyEmailCodeDto } from './dto/send-verify-email-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyCodeCommand } from '../otp/otp.commands';
import { CustomException } from './exceptions/custom.exception';

@Injectable()
@UseFilters(CustomExceptionFilter)
export class OnboardingGrcpService {

    constructor(private commandBus: CommandBus) {

    }


    @GrpcMethod("OnboardingService", "Hello")
    @UsePipes(ValidationPipe)
    hello(@Body() input: HelloInput): HelloResponse {
        var response = new HelloResponse()
        response.message = `Hello ${input.name} from micro services.`;
        return response;
    }
    @GrpcMethod("OnboardingService", "LogUserOnUisngToken")
    @UsePipes(ValidationPipe)
    async getToken(@Body() model: GetTokenDto): Promise<TokenResponseDto> {
        return await this.commandBus.execute(new GetTokenCommand(model.email, model.password))
    }

    @GrpcMethod("OnboardingService", "SendVerifyEmailCode")
    @UsePipes(ValidationPipe)
    async  sendVerificationEmail(@Body() model: SendVerifyEmailCodeDto) {
        await this.commandBus.execute(new SendVerifyEmailCodeCommand(model.email))
    }

    @GrpcMethod("OnboardingService", "VerifyEmail")
    @UsePipes(ValidationPipe)
    async verifyEmail(@Body() model: VerifyEmailDto) {
        var otpIsValid = await this.commandBus.execute(new VerifyCodeCommand(model.email, model.verificationCode));
        if (!otpIsValid)
            throw new CustomException("Invalid verification code.")
    }

    @GrpcMethod("OnboardingService", "Register")
    @UsePipes(ValidationPipe)
    async register(@Body() model: RegisterDto): Promise<TokenResponseDto> {
        return await this.commandBus.execute(new RegisterCommand(model.firstName,
            model.lastName, model.email, model.verificationCode, model.password))
    }

    @GrpcMethod("OnboardingService", "ForgotPassword")
    @UsePipes(ValidationPipe)
    async forgotPassword(model: ForgotPasswordDto) {
        await this.commandBus.execute(new ForgotPasswordCommand(model.email))
    }

    @GrpcMethod("OnboardingService", "ResetPassword")
    @UsePipes(ValidationPipe)
    async resetPassword(@Body() model: ResetPasswordDto): Promise<TokenResponseDto> {
        return await this.commandBus.execute(new ResetPasswordCommand(model.email, model.verificationCode, model.password));
    }

}
