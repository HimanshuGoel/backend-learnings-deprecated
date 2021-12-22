type RouteOptions = { start: string; end: string };
type StrategyType = 'car' | 'hitch-hike' | 'public-transport' | 'bike' | 'walking';

interface RouteStrategy {
  name: StrategyType;
  buildRoute: (routeOptions: RouteOptions) => string;
  complexCalculation: number;
}

abstract class GoogleRouteStrategy implements RouteStrategy {
  complexCalculation: number = 0;
  constructor(public name: StrategyType) {}

  buildRoute({ start, end }: RouteOptions) {
    return `From ${start} to ${end} takes ${this.complexCalculation} minutes by ${this.name} `;
  }
}

class NavigatorContext {
  private strategy: RouteStrategy | undefined;

  public setStrategy(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  public calculateRoute(routeOptions: RouteOptions) {
    if (!this.strategy) throw new Error('No strategy defined.');
    return this.strategy.buildRoute(routeOptions);
  }
}

class GoogleCarStrategy extends GoogleRouteStrategy {
  constructor() {
    super('car');
  }
  buildRoute({ start, end }: RouteOptions) {
    this.complexCalculation = ((start + end).length * 1) / 2;
    return super.buildRoute({ start, end });
  }
}
class GoogleBikeStrategy extends GoogleRouteStrategy {
  constructor() {
    super('bike');
  }
  buildRoute({ start, end }: RouteOptions) {
    this.complexCalculation = ((start + end).length * 3) / 2;
    return super.buildRoute({ start, end });
  }
}
class GoogleWalkStrategy extends GoogleRouteStrategy {
  constructor() {
    super('walking');
  }
  buildRoute({ start, end }: RouteOptions) {
    this.complexCalculation = ((start + end).length * 10) / 2;
    return super.buildRoute({ start, end });
  }
}
class GooglePublicTransportStrategy extends GoogleRouteStrategy {
  constructor() {
    super('public-transport');
  }
  buildRoute({ start, end }: RouteOptions) {
    this.complexCalculation = Math.round((start + end).length * Math.random());
    return super.buildRoute({ start, end });
  }
}

class GoogleNavigationStrategyFactory {
  createNavigationStrategy(type: StrategyType) {
    switch (type) {
      case 'car':
        return new GoogleCarStrategy();
      case 'bike':
        return new GoogleBikeStrategy();
      case 'walking':
        return new GooglePublicTransportStrategy();
      case 'public-transport':
        return new GoogleWalkStrategy();
      default:
        console.log(`The ${type} strategy is not available. Falling back to default car strategy.`);
        return new GoogleCarStrategy();
    }
  }
}

class GoogleClient {
  strategyFactory = new GoogleNavigationStrategyFactory();

  public startNavigation(options: RouteOptions, strategyType: StrategyType) {
    const navigationStrategy = this.strategyFactory.createNavigationStrategy(strategyType);
    const route = navigationStrategy.buildRoute(options);
    console.log(route);
    return route;
  }
}

const googleClient = new GoogleClient();
googleClient.startNavigation({ start: 'English Garden', end: 'Allian Arena' }, 'car');
googleClient.startNavigation({ start: 'English Garden', end: 'Allian Arena' }, 'bike');
googleClient.startNavigation({ start: 'English Garden', end: 'Allian Arena' }, 'walking');
googleClient.startNavigation({ start: 'English Garden', end: 'Allian Arena' }, 'public-transport');
