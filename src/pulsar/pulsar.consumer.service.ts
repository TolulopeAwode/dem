import { Injectable, Inject } from "@nestjs/common";
import { BaseEvent } from "./pulsar.model";
import * as Pulsar from "pulsar-client"
import { ConfigService } from "@nestjs/config";
import {
    PULSAR_SERVICE_URL_KEY,
    PULSAR_SUBSCRIPTION_KEY
} from "../constants/config.constants";

export abstract class PulsarConsumerService<T, K extends BaseEvent<T>> {

    constructor(public config: ConfigService) {

    }

    protected abstract get eventTopic(): string;
    public abstract Execute(messageId: any, message: K);

    async  subscribe() {

        const client = new Pulsar.Client({
            serviceUrl: `${this.config.get<string>(PULSAR_SERVICE_URL_KEY)}`,
            operationTimeoutSeconds: 30,
        });

        const consumer = await client.subscribe({
            topic: this.eventTopic,
            subscription: `${this.config.get<string>(PULSAR_SUBSCRIPTION_KEY)}`,
        });

        while (true) {
            const msg = await consumer.receive();
            var eventData = <K>JSON.parse(msg.getData().toString());
            this.Execute(msg.getMessageId(), eventData);
            consumer.acknowledge(msg);
        }
    }
}