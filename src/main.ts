import { ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import './config/cloudinary';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    );

  //  CORS
  app.enableCors({
    origin: [
      'https://football-booking-kappa.vercel.app',
    ],

    credentials: true,
  });

  //  Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted:
        false,

      transform: true,
    }),
  );

  await app.listen(5000);
}

bootstrap();