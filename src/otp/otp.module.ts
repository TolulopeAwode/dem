import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpRepository } from './otp.repository';
import { CommandHandlers } from './otp.command.handlers';
import { CqrsModule } from "@nestjs/cqrs"

@Module({
    imports: [TypeOrmModule.forFeature([OtpRepository]), CqrsModule],
    providers: [...CommandHandlers],
    exports: [...CommandHandlers]
})
export class OtpModule { }
