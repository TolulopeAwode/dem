import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { SendCodeCommand as SendCodeCommand, VerifyCodeCommand } from "./otp.commands";
import { InjectRepository } from "@nestjs/typeorm";
import { OtpRepository } from "./otp.repository";
import { Otp } from "./entities/otp.entity";
import { Injectable } from "@nestjs/common";

@CommandHandler(SendCodeCommand)
export class SendCodeHandler implements ICommandHandler<SendCodeCommand>{
    constructor(@InjectRepository(OtpRepository) private repository: OtpRepository) {

    }
    async  execute(command: SendCodeCommand): Promise<any> {
        var otp = await this.repository.findOne(command.recipient);
        if (!otp) {
            otp = new Otp()
        }
        otp.recipient = command.recipient;
        otp.code = '0000';
        otp.save();
    }

}
@CommandHandler(VerifyCodeCommand)
export class VerifyCodeHandler implements ICommandHandler<VerifyCodeCommand>{
    constructor(@InjectRepository(OtpRepository) private repository: OtpRepository) {

    }
    async execute(command: VerifyCodeCommand): Promise<boolean> {
        var otp = await this.repository.findOne(command.recipient);
        var result = otp && otp.code == command.code;
        console.log(result);

        return result;
    }

}

export const CommandHandlers = [SendCodeHandler, VerifyCodeHandler];