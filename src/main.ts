import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, urlencoded } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Crear instancia global para reutilizar en Vercel
let cachedApp: any;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule, 
    new ExpressAdapter(expressApp)
  );
  
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  app.enableCors({
    origin: process.env.ORIGIN_CORS || "*",
  });
  
  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  
  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

// Para desarrollo local
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  app.enableCors({
    origin: process.env.ORIGIN_CORS || "*",
  });
  
  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Ejecutar bootstrap solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

// Exportar para Vercel
export default createApp;


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
