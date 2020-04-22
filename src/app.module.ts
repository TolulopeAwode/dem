import { OnboardingGrcpService } from './onboarding/onboarding.service';
import { Module } from '@nestjs/common';


import { ConfigModule } from "@nestjs/config"

import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from './onboarding/entities/user.entity';

import { PulsarModule } from './pulsar/pulsar.module';
import { CqrsModule } from "@nestjs/cqrs"
import { OnboardingModule } from './onboarding/onboarding.module';
import { Otp } from './otp/entities/otp.entity';
import { OtpModule } from './otp/otp.module';
const typeOrmConfig: TypeOrmModuleOptions =
{
  type: "postgres",
  host: 'localhost',
  port: 5432,
  database: "RoavaOnboarding",
  username: "postgres",
  password: "Password1$",
  entities: [User, Otp],
  synchronize: true
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule, TypeOrmModule.forRoot(typeOrmConfig),
    OnboardingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
