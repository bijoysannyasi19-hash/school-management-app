import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException 
        ? exception.getResponse() 
        : exception;

    console.error('--- EXCEPTION LOG ---');
    console.error(`[${request.method}] ${request.url}`);
    console.error('Body:', typeof request.body === 'object' && request.body !== null ? { ...request.body, imageUrl: request.body.imageUrl ? '(truncated)' : undefined } : request.body);
    console.error('Error:', message);
    console.error('---------------------');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException ? (exception.getResponse() as any).message || message : 'Internal server error',
    });
  }
}
