export class ServerError extends Error {
  constructor(stack?: string) {
    super('Server failed. Try again soon');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
