import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitamos CORS para el frontend
  app.enableCors();
  
  // Habilitamos validación global
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}
bootstrap();
