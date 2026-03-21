import { DomainException } from '../../../common/domain/exceptions/domain-exception';

// En InvalidOrderOperationException.ts
export class InvalidOrderOperationException extends DomainException {
  constructor(
    messageKey: string,
    public readonly currentStatus: string,
  ) {
    super(messageKey, 400); // Pasamos la clave directamente
  }
}
