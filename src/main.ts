import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Global prefix (opcional)
  app.setGlobalPrefix('api');
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('DecoStar API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();


// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import { ValidationPipe } from "@nestjs/common";
// import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// import { json, urlencoded } from 'express';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.setGlobalPrefix("api");

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//     }),
//   );

// // Aumentar límites de payload
//   app.use(json({ limit: '50mb' }));
//   app.use(urlencoded({ extended: true, limit: '50mb' }));

//   app.enableCors({
//     origin: process.env.ORIGIN_CORS || "http://localhost:3000",
//   });

//   const config = new DocumentBuilder()
//     .setTitle('API documentation')
//     // .setDescription('La descripción de la API')
//     .setVersion('1.0')
//     .build();
    
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup("docs", app, document);

//   await app.listen(process.env.PORT || 8000);
// }
// bootstrap();
