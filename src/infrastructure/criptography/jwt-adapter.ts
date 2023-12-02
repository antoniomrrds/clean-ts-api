import { Decrypter, Encrypter } from '@/application/ports';
import { sign, verify } from 'jsonwebtoken';
export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}
  async encrypt(value: string): Promise<string> {
    const acessToken = await sign({ id: value }, this.secret);
    return acessToken;
  }
  async decrypt(token: string): Promise<string | null> {
    try {
      const value = await verify(token, this.secret);

      return value as string;
    } catch (error) {
      return null;
    }
  }
}
