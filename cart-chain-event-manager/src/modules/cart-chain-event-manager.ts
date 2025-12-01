import { ShopifyCart, ChainEvent, ChainEventAction } from "../types/index.js";

export class CartChainEventManager {
  private events: Map<string, ChainEventAction> = new Map();
  private cart: ShopifyCart | null = null;

  constructor() {}

  addChainEvent({ name, action }: ChainEvent): void {
    if (this.events.has(name)) {
      throw new Error(`Event with name ${name} already exists.`);
    }
    this.events.set(name, action);
  }

  async startChainEvent(cart: ShopifyCart): Promise<ShopifyCart | null> {
    let currentCart: ShopifyCart | null = cart;

    const eventsArray = Array.from(this.events.values());

    if (eventsArray.length === 0) {
      return currentCart;
    }

    for (const eventAction of eventsArray) {
      currentCart = await eventAction(currentCart);
      if (currentCart === null) {
        this.cart = null;
        return null;
      }
    }

    this.cart = currentCart;
    return currentCart;
  }

  async executeEvent(event: ChainEventAction, cart: ShopifyCart): Promise<ShopifyCart | null> {
    return await event(cart);
  }

  getCarts(): ShopifyCart | null {
    return this.cart;
  }
}

export function createCartChainEventManager(): CartChainEventManager {
  return new CartChainEventManager();
}
