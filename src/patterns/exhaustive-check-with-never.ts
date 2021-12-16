// With the exhaustive type checking in place, we can detect a missing condition at compile time instead of run time.

type DataTypes = 'client' | 'order';

function getProcessName(c: DataTypes): string {
  switch (c) {
    case 'client':
      return 'register' + c;
    case 'order':
      return 'process' + c;
    default:
      return assertUnreachable(c);
  }
}
function assertUnreachable(x: never): never {
  throw new Error('something is very wrong');
}
