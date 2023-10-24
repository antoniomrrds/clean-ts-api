export class EmailInUseError extends Error {
  constructor(paramName: string) {
    super(`The received email ${paramName} is already in use`);
    this.name = 'EmailInUseError';
  }
}
