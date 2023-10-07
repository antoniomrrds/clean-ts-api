/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Encrypter } from '@/application/ports/criptography';
import { sign } from 'jsonwebtoken';
export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}
  async encrypt(value: string): Promise<string> {
    const acessToken = await sign({ id: value }, this.secret);
    return acessToken;
  }
}
