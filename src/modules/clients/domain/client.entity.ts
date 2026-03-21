import { UpdateClientDto } from '../infrastructure/http/dto/update-client-dto';

export class Client {
  constructor(
    public readonly id: string | undefined,
    public readonly fullname: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly address: string,
    public readonly notes: string,
    public readonly dni: string,
  ) {}

  public update(updateClientDto: UpdateClientDto) {
    // 2. SAFE MERGE
    Object.entries(updateClientDto).forEach(([key, value]) => {
      if (key === 'id') return;
      if (value !== undefined) {
        this[key] = value;
      }
    });
  }
}
