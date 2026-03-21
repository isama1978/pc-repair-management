import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { DomainException } from '../../modules/common/domain/exceptions/domain-exception';
import { I18nContext } from 'nestjs-i18n';

@Catch() // Lo dejamos vacío para que atrape TODO lo que salte
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const i18n = I18nContext.current(host);

    let status = 500;
    let message = exception.message;
    let errorName = 'InternalServerError';

    if (exception instanceof DomainException) {
      status = exception.statusCode;
      errorName = exception.name;
      message = i18n
        ? i18n.t(`errors.${exception.message}`, { args: exception.args }) // 👈 Pasamos los args aquí
        : exception.message;
    }
    // 2. Si es una excepción propia de NestJS (como la del DTO/ValidationPipe)
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res.message || res; // Aquí capturamos el array de errores del DTO
      errorName = exception.constructor.name;
    }
    // 3. Si es un error de programación real (un bug)
    else {
      console.error('💥 Bug detectado:', exception);
    }

    response.status(status).json({
      statusCode: status,
      error: errorName,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
