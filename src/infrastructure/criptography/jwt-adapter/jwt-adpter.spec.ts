import { JwtAdapter } from '@/infrastructure/criptography/jwt-adapter';
import jwt from 'jsonwebtoken';

describe('JWT Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any_id');
    expect(signSpy).toBeCalledWith(
      {
        id: 'any_id',
      },
      'secret',
    );
  });

  it 
});
