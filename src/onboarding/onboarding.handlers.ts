import { ICommandHandler, CommandHandler, CommandBus } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRespository } from "../onboarding/onboarding.repository";

import {
    GetTokenCommand, ForgotPasswordCommand, RegisterCommand,
    ResetPasswordCommand, SendVerifyEmailCodeCommand
} from "./onboarding.commands";
import { JwtService } from "@nestjs/jwt";
import { User } from "./entities/user.entity";
import { TokenResponseDto } from "./dto/token-response.dto";
import { CustomException } from "./exceptions/custom.exception";
import { SendCodeCommand, VerifyCodeCommand } from "../otp/otp.commands";
import { PulsarService } from "../pulsar/pulsar.service";
import { USER_CREATED_EVENT_TOPIC, USER_RESETPASSWORD_EVENT_TOPIC } from "../constants/event-topics.constants";
import { UserCreatedEvent } from "./onboarding.events";


@CommandHandler(SendVerifyEmailCodeCommand)
export class SendVerifyEmailCodeHandler implements ICommandHandler<SendVerifyEmailCodeCommand>{

    constructor(private commandBus: CommandBus,
        @InjectRepository(UserRespository) private readonly userRepository: UserRespository) {
    }

    async execute(command: SendVerifyEmailCodeCommand): Promise<any> {
        var user = await this.userRepository.findUserByEmail(command.email);
        if (user)
            throw new CustomException(`${command.email} account exists. Please login to continue.`);
        await this.commandBus.execute(new SendCodeCommand(command.email));
    }
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand>{

    constructor(private pulsarServie: PulsarService,
        private jwtService: JwtService, private commandBus: CommandBus,
        @InjectRepository(UserRespository) private readonly userRepository: UserRespository) {
    }

    async execute(model: RegisterCommand): Promise<any> {
        if (await this.userRepository.findUserByEmail(model.email))
            throw new CustomException(`${model.email} is taken. please login to continue.`)

        var otpIsValid = await this.commandBus.execute(new VerifyCodeCommand(model.email, model.verificationCode));
        if (!otpIsValid)
            throw new CustomException("Invalid verification code.")

        var user = await this.registerUser(model);
        this.publishUserCreatedEvent(model.email);
        return this.generateToken(user);
    }

    private async registerUser(model: RegisterCommand) {
        var user = new User();
        user.email = model.email;
        user.firstName = model.firstName;
        user.lastName = model.lastName;
        await this.userRepository.registerUser(user, model.password);
        return user;
    }

    private generateToken(user: User) {
        var token = new TokenResponseDto();
        var payload = { username: user.email, sub: user.id };
        token.accessToken = this.jwtService.sign(payload);
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        return token;
    }

    private publishUserCreatedEvent(email: string) {
        var eventModel = new UserCreatedEvent(email);
        this.pulsarServie.producerMessage(USER_CREATED_EVENT_TOPIC, eventModel);
    }
}


@CommandHandler(GetTokenCommand)
export class GetTokenHandler implements ICommandHandler<GetTokenCommand>{

    constructor(private jwtService: JwtService,
        @InjectRepository(UserRespository) private readonly userRepository: UserRespository) {
    }

    async execute(model: GetTokenCommand): Promise<TokenResponseDto> {
        const { email, password } = model;
        var user = await this.userRepository.signInUser(email, password);
        var token = new TokenResponseDto();
        var payload = { username: user.email, sub: user.id };
        token.accessToken = this.jwtService.sign(payload);
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        return token;
    }

}
@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand>{

    constructor(private commandBus: CommandBus,
        @InjectRepository(UserRespository) private readonly userRepository: UserRespository) {
    }

    async execute(command: ForgotPasswordCommand): Promise<any> {
        var user = await this.userRepository.findUserByEmail(command.email);
        if (!user)
            throw new CustomException("Account not found.");
        await this.commandBus.execute(new SendCodeCommand(command.email));
    }
}

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand>{

    constructor(private jwtService: JwtService,
        private pulsarService: PulsarService,
        private commandBus: CommandBus,
        @InjectRepository(UserRespository) private readonly userRepository: UserRespository) {
    }

    async execute(command: ResetPasswordCommand): Promise<TokenResponseDto> {
        var otpIsValid = await this.commandBus.execute(new VerifyCodeCommand(command.email, command.verificationCode));
        if (!otpIsValid)
            throw new CustomException("Invalid verification code.")
        var user = await this.userRepository.resetPassword(command.email, command.password);
        var token = this.generateToken(user);
        this.publishUserResetPasswordEvent(user.email);
        return token;
    }

    private async  publishUserResetPasswordEvent(email: string) {
        var eventModel = new UserCreatedEvent(email);
        await this.pulsarService.producerMessage(USER_RESETPASSWORD_EVENT_TOPIC, eventModel);
    }

    private generateToken(user: User) {
        var token = new TokenResponseDto();
        var payload = { username: user.email, sub: user.id };
        token.accessToken = this.jwtService.sign(payload);
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        return token;
    }
}
export const CommandHandlers = [SendVerifyEmailCodeHandler,
    RegisterHandler, GetTokenHandler, ResetPasswordHandler, ForgotPasswordHandler];