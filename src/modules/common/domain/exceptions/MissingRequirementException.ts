import { DomainException } from './domain-exception';

export class MissingRequirementException extends DomainException {
  constructor(requirement: string) {
    super(`Falta un requisito obligatorio: ${requirement}`, 400);
  }
}
