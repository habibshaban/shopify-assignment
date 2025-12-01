# Cart Chain Event Manager

A TypeScript library for managing chain events on Shopify carts. This allows you to create a pipeline of sequential operations that transform a cart, with support for early termination.

## Features

- **Chain Events**: Register multiple cart transformation functions that execute in sequence
- **Early Termination**: Chain stops if any event returns `null`
- **Type Safety**: Full TypeScript support with Shopify cart types
- **Async Support**: Works with both sync and async event handlers

## Installation

```bash
npm install
```

## Usage

```typescript
import { createCartChainEventManager } from "./modules/cart-chain-event-manager";
import { ShopifyCart } from "./types";

// Create a new manager
const manager = createCartChainEventManager();

// Add chain events
manager.addChainEvent({
  name: "validateCart",
  action: async (cart: ShopifyCart) => {
    if (cart.items.length === 0) {
      return null; // Stop the chain
    }
    return cart;
  },
});

manager.addChainEvent({
  name: "addGiftItem",
  action: async (cart: ShopifyCart) => {
    if (cart.total_price >= 10000) {
      // Add gift logic here
      return { ...cart, note: "Gift added!" };
    }
    return cart;
  },
});

// Execute the chain
const cart: ShopifyCart = {
  /* ... your cart data */
};
const result = await manager.startChainEvent(cart);

if (result === null) {
  console.log("Chain was terminated early");
} else {
  console.log("Final cart:", result);
}
```

## API

### `createCartChainEventManager()`

Creates a new instance of `CartChainEventManager`.

### `CartChainEventManager`

#### `addChainEvent({ name, action })`

Registers a new chain event.

- `name`: Unique identifier for the event
- `action`: Function that receives a cart and returns a modified cart or `null`

Throws an error if an event with the same name already exists.

#### `startChainEvent(cart)`

Executes all registered events in order, passing the cart through each one.

Returns `null` if any event returns `null`, otherwise returns the final transformed cart.

#### `getCarts()`

Returns the last processed cart, or `null` if no chain has been executed.

## Scripts

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Type check
npm run lint

# Clean build artifacts
npm run clean
```

## Project Structure

```
src/
├── index.ts                    # Main entry point
├── modules/
│   ├── cart-chain-event-manager.ts  # Core manager
├── types/
│   └── index.ts                # TypeScript interfaces
└── __tests__/
    └── cart-chain-event-manager.test.ts
```
