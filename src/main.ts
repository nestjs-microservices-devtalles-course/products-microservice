import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('Products Microservice is running...'))
  .catch((err) => console.error('Error starting the microservice:', err));
