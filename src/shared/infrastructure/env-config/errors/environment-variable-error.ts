export class EnvironmentVariableError extends Error {
  constructor(environmentVariable: string) {
    super(
      `Couldn't find or provide a default value for environment variable: ${environmentVariable}`,
    );
    this.name = 'EnvironmentVariableError';
  }
}
