// Clients should not be forced to implement interfaces they do not use.
// Let’s say we have a Client type, it’s used at multiple places. Sometimes only a subset of properties is used. According to the interface segregation principle, the function parameter with the type should be the minimal type required.

interface Client {
  name: string;
  dateOfBirth: Date;
  active: boolean;
}

type ClientSummary = Pick<Client, 'name' | 'active'>;

const clients: ClientSummary = {
  name: 'John',
  active: true
};

type ClientSummary2 = Exclude<Client, 'dateOfBirth'>;
