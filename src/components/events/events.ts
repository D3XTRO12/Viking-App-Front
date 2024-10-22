// events.ts
type Listener = () => void;

class CustomEventEmitter {
  private listeners: { [key: string]: Listener[] } = {};

  emit(eventName: string) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(callback => callback());
    }
  }

  addListener(eventName: string, callback: Listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
    
    return {
      remove: () => this.removeListener(eventName, callback)
    };
  }

  removeListener(eventName: string, callback: Listener) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        listener => listener !== callback
      );
    }
  }
}

const eventEmitter = new CustomEventEmitter();

export const refreshWorkOrders = () => {
  eventEmitter.emit('refreshWorkOrders');
};

export const addEventListener = (eventName: string, callback: () => void) => {
  return eventEmitter.addListener(eventName, callback);
};