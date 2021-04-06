export class WrongVariableTypeError extends Error {
  constructor(varName: string, varType: string, value: any) {
    super(`Variable with name '${varName}' isn't type of '${varType}', value is < ${value} >`);
  }
}
