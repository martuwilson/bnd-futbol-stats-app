import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  // 🛡️ Security Configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  });
  
  // 🔍 Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 📱 Mobile-friendly configuration
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  
  // 🚀 Start server
  const port = process.env.PORT ?? 3002;
  await app.listen(port, '0.0.0.0');
  
  // 📊 Startup logs
  const environment = process.env.NODE_ENV || 'development';
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
  logger.log(`🌐 Environment: ${environment}`);
  logger.log(`📱 CORS enabled for: ${process.env.CORS_ORIGIN || '*'}`);
  logger.log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Local SQLite'}`);
  
  if (environment === 'development') {
    logger.log(`🔍 Health Check: http://localhost:${port}/health`);
  }
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ Application failed to start', error);
  process.exit(1);
});
