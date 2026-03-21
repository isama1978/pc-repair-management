import { DomainException } from './domain-exception';

export class InvalidDomainValueException extends DomainException {
  constructor(message: string) {
    super(message, 400);
  }
}
