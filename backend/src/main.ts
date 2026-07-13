import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { join } from 'path';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  
  app.enableCors();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Seed the database with the initial super admin if it doesn't exist
  const usersService = app.get(UsersService);
  await usersService.setupInitialSuperAdmin();
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
