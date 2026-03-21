import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/modules/common/domain/exceptions/domain-exception';

export class PartNotFoundException extends DomainException {
  constructor(partId: string) {
    super(`Part with ID "${partId}" not found`, HttpStatus.NOT_FOUND);
  }
}
