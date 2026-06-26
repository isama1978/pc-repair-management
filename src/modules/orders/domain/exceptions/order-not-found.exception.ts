import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../common/domain/exceptions/domain-exception';

export class OrderNotFoundException extends DomainException {
  constructor(orderId: string) {
    super(`Order with ID "${orderId}" not found`, HttpStatus.NOT_FOUND);
  }
}
