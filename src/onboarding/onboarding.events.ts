import { BaseEvent } from "../pulsar/pulsar.model";

export class UserCreatedEvent extends BaseEvent<string> {
    constructor(email: string) {
        super();
        this.data = email;
    }
    data: string;
}

export class UserResetPasswordEvent extends BaseEvent<string> {
    constructor(email: string) {
        super();
        this.data = email;
    }
    data: string;
}
