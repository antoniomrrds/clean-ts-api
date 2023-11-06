/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Decrypter, Encrypter } from '@/application/ports/criptography';
import { sign, verify } from 'jsonwebtoken';
export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}
  async encrypt(value: string): Promise<string> {
    const acessToken = await sign({ id: value }, this.secret);
    return acessToken;
  }
  async decrypt(token: string): Promise<string> {
    await verify(token, this.secret);
    return null as any;
  }
}
