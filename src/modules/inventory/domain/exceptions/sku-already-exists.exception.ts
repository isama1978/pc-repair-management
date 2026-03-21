import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../common/domain/exceptions/domain-exception';

export class SkuAlreadyExistsException extends DomainException {
  constructor(sku: string) {
    super(`SKU "${sku}" already exists`, HttpStatus.BAD_REQUEST);
  }
}
