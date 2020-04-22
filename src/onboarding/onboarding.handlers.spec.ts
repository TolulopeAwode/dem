import { Test } from "@nestjs/testing"
import { CommandBus } from "@nestjs/cqrs";

import { SendVerifyEmailCodeHandler, RegisterHandler } from "./onboarding.handlers";
import { UserRespository } from "./onboarding.repository";
import { json } from "express";
import { SendVerifyEmailCodeCommand, RegisterCommand } from "./onboarding.commands";
import { PulsarService } from "../pulsar/pulsar.service";
import { JwtService } from "@nestjs/jwt";

const commandBusMock = () => ({
    execute: jest.fn()
});
const userRepositoryMock = () => ({
    findUserByEmail: jest.fn(),
    registerUser: jest.fn()
});
const pulsarServieMock = () => ({
    producerMessage: jest.fn()
});
const jwtServiceMock = () => ({
    sign: jest.fn()
})
describe("SendVerifyEmailCodeHandler", () => {

    let userRepository;
    let commandBus;
    let sendVerifyEmailCodeHandler: SendVerifyEmailCodeHandler

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: CommandBus,
                    useFactory: commandBusMock
                },
                {
                    provide: UserRespository,
                    useFactory: userRepositoryMock
                },
                SendVerifyEmailCodeHandler
            ],
        }).compile();

        userRepository = moduleRef.get(UserRespository);
        commandBus = moduleRef.get(CommandBus);
        sendVerifyEmailCodeHandler = moduleRef.get<SendVerifyEmailCodeHandler>(SendVerifyEmailCodeHandler);
    });
    describe("execute", () => {

        it("findUserByEmail not have been called", async () => {
            expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
        })
        it("to throw an error when user already exist in the system.", async () => {
            expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
            let command = new SendVerifyEmailCodeCommand("a6ee6@yahoo.com");
            userRepository.findUserByEmail.mockResolvedValue({ email: command.email })
            expect(sendVerifyEmailCodeHandler.execute(command)).rejects.toThrowError();
        })
        it("findUserByEmail not have been called", async () => {
            expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
            let command = new SendVerifyEmailCodeCommand("a6ee6@yahoo.com");
            await sendVerifyEmailCodeHandler.execute(command);
            expect(userRepository.findUserByEmail).toHaveBeenCalledWith(command.email);
            expect(commandBus.execute).toHaveBeenCalledWith({ recipient: command.email })
        })
    })
});
describe("RegisterHandler", () => {

    let userRepository;
    let commandBus;
    let registerHandler: RegisterHandler
    let pulsarServie
    let jwtService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: CommandBus,
                    useFactory: commandBusMock
                },
                {
                    provide: UserRespository,
                    useFactory: userRepositoryMock
                },
                {
                    provide: PulsarService,
                    useFactory: pulsarServieMock
                },
                {
                    provide: JwtService,
                    useFactory: jwtServiceMock
                },
                RegisterHandler
            ],
        }).compile();

        userRepository = moduleRef.get(UserRespository);
        commandBus = moduleRef.get(CommandBus);
        registerHandler = moduleRef.get<RegisterHandler>(RegisterHandler);
        pulsarServie = moduleRef.get(PulsarService)
        jwtService = moduleRef.get(JwtService);
    });
    describe("execute", () => {

        it("findUserByEmail not have been called", async () => {
            expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
        })
        it("to throw an error when user already exist in the system.", async () => {
            expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
            let command = new RegisterCommand("Azeez", "Lawal", "a6ee6@yahoo.com", "0000", "Password1$");
            userRepository.findUserByEmail.mockResolvedValue({ email: command.email })
            expect(registerHandler.execute(command)).rejects.toThrowError();
        })
        it("token genrated and produce user created event", async () => {
            expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
            let command = new RegisterCommand("Azeez", "Lawal", "a6ee6@yahoo.com", "0000", "Password1$");
            commandBus.execute.mockResolvedValue(true)
            userRepository.registerUser.mockResolvedValue({ email: command.email })
            jwtService.sign.mockReturnValue("fasdfhasdkfashdfifakfipoi")
            await registerHandler.execute(command);
            expect(userRepository.findUserByEmail).toHaveBeenCalledWith();
            expect(commandBus.execute).toHaveBeenCalledWith();
            expect(pulsarServie.producerMessage).toHaveBeenCalledWith();
        })
    })
});