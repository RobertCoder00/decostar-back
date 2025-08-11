import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix("api");
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  
  // Aumentar límites de payload
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  app.enableCors({
    origin: process.env.ORIGIN_CORS || true, // Cambiar para producción
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('DecoStar API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  
  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0'); // Importante: bind a 0.0.0.0
  
  console.log(`Application running on port ${port}`);
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
