// The factory design pattern defines an interface or an abstract class and allows subclasses to decide which object to instantiate. In that way, we are adding polymorphic behavior to the instantiation.
// It allows clients to create objects using a common interface. In TypeScript, there are many different ways in which you can use the factory pattern to make your code cleaner and more concise.

interface BaseUser {
  id: string;
  name: string;
  accessToken: string | null;
  credentials: {
    username: string;
    password: string;
  };
}

interface Administrator extends BaseUser {
  roles: string[];
}

interface Ordinary extends BaseUser {
  tasks: string[];
}

interface Authentication<T extends BaseUser> {
  signIn(user: T): Promise<T>;
  signOut(user: T): void;
}

function createAuthentication<T extends BaseUser>() {
  return class User implements Authentication<T> {
    public isAuthenticated = false;

    public async signIn(user: T): Promise<T> {
      // call user authentication
      const data = await fetch('/authenticate', {
        method: 'POST',
        body: JSON.stringify(user.credentials)
      });

      const resultUser = (await data.json()) as T;

      this.isAuthenticated = true;
      user.accessToken = resultUser.accessToken;

      return (await data.json()) as T;
    }

    public signOut(user: T): void {
      this.isAuthenticated = false;
      user.accessToken = null;
    }
  };
}

const AdminAuth = createAuthentication<Administrator>();
const adminAuth = new AdminAuth();

adminAuth.signIn({
  id: 'adm.1234',
  name: 'Cesar Admin',
  accessToken: 'adm.token.1234',
  credentials: {
    username: 'cesar.admin',
    password: '1234'
  },
  roles: []
});

const OrdinaryAuth = createAuthentication<Ordinary>();
const ordinaryAuth = new OrdinaryAuth();

ordinaryAuth.signOut({
  id: '1234',
  name: 'Cesar',
  accessToken: '1234',
  credentials: {
    username: 'cesar',
    password: '1234'
  },
  tasks: []
});
