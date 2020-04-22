import { PulsarConsumerService } from "src/pulsar/pulsar.consumer.service";
import { UserCreatedEvent, UserResetPasswordEvent } from "./onboarding.events";
import { USER_CREATED_EVENT_TOPIC } from "src/constants/event-topics.constants";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserCreatedHandler extends PulsarConsumerService<string, UserCreatedEvent>{
    constructor(config: ConfigService) {
        super(config)
    }
    protected get eventTopic(): string {
        return USER_CREATED_EVENT_TOPIC;
    }
    public Execute(messageId: any, message: UserCreatedEvent) {
        console.log(message);
    }
}

@Injectable()
export class UserResetPasswordHandler extends PulsarConsumerService<string, UserResetPasswordEvent>{
    constructor(config: ConfigService) {
        super(config)
    }
    protected get eventTopic(): string {
        return USER_CREATED_EVENT_TOPIC;
    }
    public Execute(messageId: any, message: UserCreatedEvent) {
        console.log(message);

    }

}
export const EventHandlers = [UserCreatedHandler, UserResetPasswordHandler];