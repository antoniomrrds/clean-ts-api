import { getOrDefaultEnvironmentVariable } from '@/shared';
import { EnvironmentVariableError } from '@/shared/errors';

describe('getOrDefaultEnvironmentVariable', () => {
  beforeEach(() => {
    process.env.TEST = 'any_value';
  });

  afterEach(() => {
    delete process.env.TEST;
  });

  it('should return the value of an existing environment variable', () => {
    const result = getOrDefaultEnvironmentVariable('TEST');
    expect(result).toEqual('any_value');
  });

  it('should return the default value if the environment variable is not defined', () => {
    const result = getOrDefaultEnvironmentVariable(
      'NON_EXISTENT_VARIABLE',
      'default_value',
    );
    expect(result).toEqual('default_value');
  });

  it('should throw an error if the environment variable is not defined and no default value is provided', () => {
    expect(() => {
      getOrDefaultEnvironmentVariable('NON_EXISTENT_VARIABLE');
    }).toThrow(EnvironmentVariableError);
  });

  it('should return the default value if the environment variable is empty', () => {
    process.env.TEST = '';
    const result = getOrDefaultEnvironmentVariable('TEST', 'default_value');
    expect(result).toEqual('default_value');
  });

  it('should throw an error if the environment variable is empty and no default value is provided', () => {
    process.env.TEST = '';
    expect(() => {
      getOrDefaultEnvironmentVariable('TEST');
    }).toThrow(EnvironmentVariableError);
  });
});
