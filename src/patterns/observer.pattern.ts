type Listerner<T> = (event: T) => void;

/**
 * Function to create a generic observer
 */
function createObserver<T>(): {
  subscribe: (listerner: Listerner<T>) => () => void;
  publish: (event: T) => void;
} {
  let listeners: Listerner<T>[] = [];

  return {
    subscribe: (listener: Listerner<T>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: T) => {
      listeners.forEach((listener) => listener(event));
    }
  };
}

/**
 * Observable
 */
class User {
  private userToken: string = 'ANONYMOUS USER TOKEN';
  private static userInstance: User;
  private userTokenChangedListeners = createObserver<string>();

  private constructor() {}

  public static get instance(): User {
    if (!User.userInstance) {
      User.userInstance = new User();
    }

    return User.userInstance;
  }

  public get token(): string {
    return this.userToken;
  }

  public set token(newToken: string) {
    this.userToken = newToken;

    // Notify all observers
    this.userTokenChangedListeners.publish(newToken);
  }

  /**
   * Add an observer
   *
   * @param listener oberserver callback
   * @returns unsubscribe function
   */
  public subscribe(listener: Listerner<string>): () => void {
    return this.userTokenChangedListeners.subscribe(listener);
  }
}

/**
 * Observer
 */
class FetchTransport {
  private headers = new Headers();

  public constructor(authToken: string) {
    this.headers.append('Authorization', `Bearer ${authToken}`);

    User.instance.subscribe(this.handleUserTokenChange.bind(this));
  }

  private handleUserTokenChange(authToken: String) {
    this.headers.append('Authorization', `Bearer ${authToken}`);
  }
}
