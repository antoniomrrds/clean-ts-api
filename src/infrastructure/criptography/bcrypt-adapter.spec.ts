import { BcryptAdapter } from '@/infrastructure/criptography';
import bcrypt from 'bcrypt';
describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => 'hash');
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hash');
  });
});
