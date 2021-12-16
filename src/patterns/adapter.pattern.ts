interface Connector {
  name: string;
  voltage: number;
}

class ConnectorUsa implements Connector {
  public voltage: 120 = 120;
  public name = 'US-Power-Plug';
}

class ConnectorGermany implements Connector {
  public voltage: 230 = 230;
  public name = 'German-Power-Plug';
}

abstract class SocketClient<T extends Connector> {
  constructor(protected connector: T) {}

  plugin(connector: T) {
    if (connector.voltage !== this.connector.voltage) {
      console.error(
        `Failed to connect ${connector.name} with ${this.connector.name}. Expected ${this.connector.voltage} V but got ${connector.voltage} V`
      );
      return;
    }
    console.log(
      `Successfully connected ${connector.name} to ${this.connector.name} with ${connector.voltage} V`
    );
  }
}

class UsSocketClient extends SocketClient<ConnectorUsa> {
  constructor() {
    super({ voltage: 120, name: 'US-Power-Socket' });
  }
}

class GermanSocketClient extends SocketClient<ConnectorGermany> {
  constructor() {
    super({ voltage: 230, name: 'German-Power-Socket' });
  }
}

class GermanToUsConnectorAdapter implements ConnectorUsa {
  public voltage!: 120;
  public name!: string;
  constructor({ name }: ConnectorGermany) {
    this.name = name;
    this.voltage = 120;
    console.log(`Adapt ${name} connector to a US-connector.`);
  }
}

const germanSocket = new GermanSocketClient();
const usSocket = new UsSocketClient();
const germanPowerPlugAdaptee = new ConnectorGermany();
const usPowerPlugAdaptee = new ConnectorUsa();

// Compatible
germanSocket.plugin(germanPowerPlugAdaptee);

// Compatible
usSocket.plugin(usPowerPlugAdaptee);

/**
 * Not Compatible
 *
 * This will throw an error because the adaptee is not compatible to the target.
 *
 * Since we provided good typings, Typescript already recognizes that:
 * Argument of type 'ConnectorGermany' is not assignable to parameter of type 'ConnectorUsa'.
 */
// usSocket.plugin(germanPowerPlugAdaptee);

// Compatible
usSocket.plugin(new GermanToUsConnectorAdapter(germanPowerPlugAdaptee));
