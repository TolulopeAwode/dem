import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ResponseTransformerIntersector } from './onboarding/interceptors/reponse-transformer.interceptor';


async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  await httpApp.listen(process.env.PORT);
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'onboarding',
  //     protoPath: join(__dirname, 'onboarding/onboarding.proto'),
  //   }
  // });
  // app.useGlobalInterceptors(new ResponseTransformerIntersector())
  // app.listen(() => {
  //   console.log(`Microservice started listening. on `);

  // })
}
bootstrap();
