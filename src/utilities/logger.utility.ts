export default class Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static log(...args: any) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static debug(...args: any[]) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static error(...args: any[]) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
}
