import { BaseEvent } from "src/pulsar/pulsar.model";

export class SendCodeCommand {
    constructor(public recipient: string) { }
}

export class VerifyCodeCommand {
    constructor(public recipient: string,
        public code: string) { }

}