import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, urlencoded } from 'express';

async function createNestApp() {
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
  
  return app;
}

// Para desarrollo local
async function bootstrap() {
  const app = await createNestApp();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Solo ejecutar bootstrap en desarrollo
if (require.main === module) {
  bootstrap();
}

// Para Vercel - exportar handler
module.exports = async (req, res) => {
  const app = await createNestApp();
  await app.init();
  
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};


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
