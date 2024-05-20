import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    { logger: ['log', 'debug'] }
  );
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setTitle('Crypto POS Docs')
    .setDescription('Crypto POS API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const configSvc = app.get(ConfigService)
  await app.listen(configSvc.get<number>('PORT'))
  console.log(`Application running on: ${await app.getUrl()}`)
}
bootstrap();
