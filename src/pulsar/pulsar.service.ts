import { Injectable } from '@nestjs/common';
import * as pulsar from "pulsar-client"
import { BaseEvent } from './pulsar.model';
import { ConfigService } from '@nestjs/config';
import { PULSAR_SERVICE_URL_KEY } from '../constants/config.constants';

@Injectable()
export class PulsarService {

    constructor(private readonly config: ConfigService) {

    }
    async  producerMessage<T>(topic: string, message: BaseEvent<T>) {
        const client = new pulsar.Client({
            serviceUrl: `${this.config.get<string>(PULSAR_SERVICE_URL_KEY)}`,

        });
        const producer = await client.createProducer({
            topic: topic
        });

        var r = JSON.stringify(message)
        await producer.send({
            data: Buffer.from(r),
        });
        producer.flush()
        await producer.close();
        await client.close();
    }

}
