type Listener = (value: string) => void;

type Unsubscribe = { unsubscribe: () => void };

class EventService {
  private listeners: Listener[] = [];

  protected static instance: EventService;

  private constructor() {}

  public static getInstance() {
    if (!EventService.instance) EventService.instance = new EventService();
    return EventService.instance;
  }

  public emit(value: string) {
    this.notifyListeners(value);
  }

  subscribe(listener: Listener): Unsubscribe {
    this.listeners.push(listener);
    return {
      unsubscribe: () => {
        // unsubscribe function
        this.listeners = this.listeners.filter((other) => other !== listener);
      }
    };
  }

  private notifyListeners(value: string) {
    this.listeners.forEach((listener) => listener(value));
  }
}

const eventService = EventService.getInstance();

/**
 * Error because constructor is private:
 * Constructor of class 'EventService' is private and only accessible within the class declaration
 */
// const anotherEventService = new EventService();

const eventSubscription = eventService.subscribe((event) => console.log(event));

eventService.emit('First Event');

EventService.getInstance().emit('Second Event');

eventSubscription.unsubscribe();
