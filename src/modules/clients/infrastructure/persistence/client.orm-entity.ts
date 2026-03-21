import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clients')
export class ClientOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, name: 'full_name' })
  fullname: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 1000 })
  notes: string;

  @Column({ length: 20 })
  dni: string;
}
