export function assertNever(value: never): never {
  void value;

  throw new Error(
    'Supposed unreachable code was executed. This code shall not be executed.'
  );
}
