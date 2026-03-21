// src/modules/common/domain/exceptions/domain-exception.ts
export class DomainException extends Error {
  constructor(
    public readonly message: string, // Esta es la KEY de i18n (ej: 'INSUFFICIENT_STOCK')
    public readonly statusCode: number = 400,
    public readonly args?: Record<string, any>, // 👈 AGREGAMOS ESTO para las variables
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
