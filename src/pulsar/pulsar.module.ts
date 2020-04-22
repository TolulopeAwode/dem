import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PulsarService } from './pulsar.service';

@Module({
    imports: [ConfigService],
    providers: [PulsarService],
    exports: [PulsarService]
})
export class PulsarModule { }
