import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.MODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Urls Shortener')
      .setDescription(
        'Api for getting short url equivalent and user authorization, authentication',
      )
      .setVersion('v1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Token',
          in: 'header',
        },
        'JWT Auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);
  }

  await app.listen(7575);
}

bootstrap();
