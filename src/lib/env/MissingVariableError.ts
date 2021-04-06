export class MissingVariableError extends Error {
  constructor(varName: string) {
    super(`Variable with name \`${varName}\` is missing`);
  }
}
