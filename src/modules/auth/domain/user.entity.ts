/* USER DOMAIN ENTITY
   Represents a staff member (Admin or Technician).
*/

import { InvalidDomainValueException } from 'src/modules/common/domain/exceptions/InvalidDomainValueException';

export enum UserRole {
  ADMIN = 'ADMIN',
  TECH = 'TECH',
}

export interface UserProps {
  id?: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  isActive?: boolean;
}

export class User {
  constructor(private readonly props: UserProps) {
    if (!props.email.includes('@'))
      throw new InvalidDomainValueException('El formato del email es inválido');
  }

  // Getters to expose data
  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get fullName() {
    return this.props.fullName;
  }
  get role() {
    return this.props.role;
  }
}
