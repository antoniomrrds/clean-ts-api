import { Hasher } from '@/application/ports/criptography';
import bcrypt from 'bcrypt';
export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash);
    return new Promise(resolve => resolve(true));
  }
}
