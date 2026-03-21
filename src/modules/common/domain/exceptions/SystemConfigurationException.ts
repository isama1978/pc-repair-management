import { DomainException } from './domain-exception';

export class SystemConfigurationException extends DomainException {
  constructor(detail: string) {
    super(`Error de configuración del sistema: ${detail}`, 500);
  }
}
