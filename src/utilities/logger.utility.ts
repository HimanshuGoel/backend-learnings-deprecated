import util from 'util';

export default class Logger {
  public static log(...args: any) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  public static debug(...args: any[]) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }

  public static inspect(...args: any[]) {
    // eslint-disable-next-line no-console
    console.log(util.inspect(args));
  }

  public static error(...args: any[]) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
}
