import { OnboardingController } from './onboarding.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRespository } from './onboarding.repository';
import { JwtModule } from "@nestjs/jwt";
import { CqrsModule } from '@nestjs/cqrs';

import { OnboardingGrcpService } from './onboarding.service';
import { OtpModule } from '../otp/otp.module';
import { CommandHandlers } from './onboarding.handlers';
import { OtpRepository } from '../otp/otp.repository';
import { PulsarModule } from 'src/pulsar/pulsar.module';
import { PulsarService } from 'src/pulsar/pulsar.service';
import { UserCreatedHandler, EventHandlers, UserResetPasswordHandler } from './onboarding.event.handlers';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [CqrsModule, OtpModule, PulsarModule, ConfigModule,
        TypeOrmModule.forFeature([UserRespository]),
        JwtModule.register({
            secret: "testing123",
            signOptions: {
                expiresIn: 3600
            }
        }),],
    controllers: [OnboardingController],
    providers: [OnboardingGrcpService, ...CommandHandlers, ...EventHandlers]
})
export class OnboardingModule {
    constructor(userCreatedHandler: UserCreatedHandler, userResetPasswordHandler: UserResetPasswordHandler) {
        userCreatedHandler.subscribe()
        userResetPasswordHandler.subscribe();
    }
}
