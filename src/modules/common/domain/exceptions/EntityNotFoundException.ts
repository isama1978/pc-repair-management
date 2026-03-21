import { DomainException } from './domain-exception';

export class EntityNotFoundException extends DomainException {
  constructor(entity: string, identifier: string | number) {
    super(
      `${entity} con identificador "${identifier}" no fue encontrado.`,
      404,
    );
  }
}
