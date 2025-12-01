import {
  CartChainEventManager,
  createCartChainEventManager,
} from "../modules/cart-chain-event-manager.js";
import { ShopifyCart, ShopifyLineItem, ChainEventAction } from "../types/index.js";

// Helper to create a mock line item
const createMockLineItem = (overrides: Partial<ShopifyLineItem> = {}): ShopifyLineItem => ({
  id: 1,
  key: "key_1",
  product_id: 100,
  variant_id: 1000,
  sku: "SKU-001",
  vendor: "Test Vendor",
  title: "Test Product",
  variant_title: null,
  image_url: null,
  taxable: true,
  requires_shipping: true,
  gift_card: false,
  price: "50.00",
  compare_at_price: null,
  line_price: "50.00",
  original_line_price: "50.00",
  total_discount: "0.00",
  discounts: [],
  discount_allocations: [],
  grams: 100,
  quantity: 1,
  fulfillment_service: "manual",
  properties: [],
  product_has_only_default_variant: true,
  product_title: "Test Product",
  product_description: "Test Description",
  product_type: "Test Type",
  handle: "test-product",
  url: "/products/test-product",
  featured_image: null,
  options_with_values: [],
  final_line_price: "50.00",
  final_price: "50.00",
  original_price: "50.00",
  unit_price: null,
  unit_price_measurement: null,
  ...overrides,
});

// Helper to create a mock cart
const createMockCart = (overrides: Partial<ShopifyCart> = {}): ShopifyCart => ({
  token: "test-token",
  note: null,
  attributes: {},
  original_total_price: 5000, // $50.00 in cents
  total_price: 5000,
  total_discount: 0,
  total_weight: 100,
  item_count: 1,
  items: [createMockLineItem()],
  requires_shipping: true,
  currency: "USD",
  items_subtotal_price: 5000,
  cart_level_discount_applications: [],
  ...overrides,
});

// Gift product constants
const GIFT_VARIANT_ID = 9999;
const GIFT_PRODUCT_ID = 999;
const MINIMUM_AMOUNT_FOR_GIFT = 10000; // $100.00 in cents

// Create gift line item
const createGiftLineItem = (): ShopifyLineItem =>
  createMockLineItem({
    id: 2,
    key: "gift_key",
    product_id: GIFT_PRODUCT_ID,
    variant_id: GIFT_VARIANT_ID,
    sku: "GIFT-001",
    title: "Free Gift",
    price: "0.00",
    line_price: "0.00",
    original_line_price: "0.00",
    final_line_price: "0.00",
    final_price: "0.00",
    original_price: "0.00",
    properties: [{ name: "_is_gift", value: "true" }],
  });

describe("CartChainEventManager", () => {
  let manager: CartChainEventManager;

  beforeEach(() => {
    manager = createCartChainEventManager();
  });

  describe("addChainEvent", () => {
    it("should add a chain event successfully", () => {
      const mockAction: ChainEventAction = async (cart) => cart;

      expect(() => {
        manager.addChainEvent({ name: "testEvent", action: mockAction });
      }).not.toThrow();
    });

    it("should throw error when adding duplicate event name", () => {
      const mockAction: ChainEventAction = async (cart) => cart;

      manager.addChainEvent({ name: "testEvent", action: mockAction });

      expect(() => {
        manager.addChainEvent({ name: "testEvent", action: mockAction });
      }).toThrow("Event with name testEvent already exists.");
    });
  });

  describe("startChainEvent", () => {
    it("should return cart unchanged when no events are registered", async () => {
      const cart = createMockCart();
      const result = await manager.startChainEvent(cart);

      expect(result).toEqual(cart);
    });

    it("should execute single event and return modified cart", async () => {
      const cart = createMockCart();
      const modifiedCart = { ...cart, note: "Modified" };

      const mockAction: ChainEventAction = async () => modifiedCart;
      manager.addChainEvent({ name: "modifyNote", action: mockAction });

      const result = await manager.startChainEvent(cart);

      expect(result).toEqual(modifiedCart);
    });

    it("should return null and stop chain when an event returns null", async () => {
      const cart = createMockCart();

      const firstAction: ChainEventAction = async () => null;
      const secondAction: ChainEventAction = jest.fn(async (c) => c);

      manager.addChainEvent({ name: "firstEvent", action: firstAction });
      manager.addChainEvent({ name: "secondEvent", action: secondAction });

      const result = await manager.startChainEvent(cart);

      expect(result).toBeNull();
      expect(secondAction).not.toHaveBeenCalled();
    });

    it("should return null and stop chain when an event returns undefined", async () => {
      const cart = createMockCart();

      const firstAction: ChainEventAction = async () => undefined as unknown as null;
      const secondAction: ChainEventAction = jest.fn(async (c) => c);

      manager.addChainEvent({ name: "firstEvent", action: firstAction });
      manager.addChainEvent({ name: "secondEvent", action: secondAction });

      const result = await manager.startChainEvent(cart);

      expect(result).toBeNull();
      expect(secondAction).not.toHaveBeenCalled();
    });
  });

  describe("Gift product chain events scenario", () => {
    // Event 1: Add gift product if cart total is more than $100
    const addGiftIfOverThreshold: ChainEventAction = async (cart: ShopifyCart) => {
      if (cart.total_price > MINIMUM_AMOUNT_FOR_GIFT) {
        // Check if gift already exists
        const giftExists = cart.items.some((item) => item.variant_id === GIFT_VARIANT_ID);

        if (!giftExists) {
          const giftItem = createGiftLineItem();
          return {
            ...cart,
            items: [...cart.items, giftItem],
            item_count: cart.item_count + 1,
          };
        }
      }
      return cart;
    };

    // Event 2: Update cart attributes with gift variant id
    const updateCartAttributesWithGiftId: ChainEventAction = async (cart: ShopifyCart) => {
      const giftItem = cart.items.find((item) => item.variant_id === GIFT_VARIANT_ID);

      if (giftItem) {
        return {
          ...cart,
          attributes: {
            ...cart.attributes,
            gift_variant_id: String(giftItem.variant_id),
          },
        };
      }
      return cart;
    };

    it("should NOT add gift when cart total is less than $100", async () => {
      const cart = createMockCart({
        total_price: 5000, // $50.00
      });

      manager.addChainEvent({ name: "addGift", action: addGiftIfOverThreshold });
      manager.addChainEvent({
        name: "updateAttributes",
        action: updateCartAttributesWithGiftId,
      });

      const result = await manager.startChainEvent(cart);

      expect(result).not.toBeNull();
      expect(result!.items).toHaveLength(1);
      expect(result!.attributes.gift_variant_id).toBeUndefined();
    });

    it("should NOT add gift when cart total is exactly $100", async () => {
      const cart = createMockCart({
        total_price: 10000, // $100.00 exactly
      });

      manager.addChainEvent({ name: "addGift", action: addGiftIfOverThreshold });
      manager.addChainEvent({
        name: "updateAttributes",
        action: updateCartAttributesWithGiftId,
      });

      const result = await manager.startChainEvent(cart);

      expect(result).not.toBeNull();
      expect(result!.items).toHaveLength(1);
      expect(result!.attributes.gift_variant_id).toBeUndefined();
    });

    it("should add gift and update attributes when cart total is more than $100", async () => {
      const cart = createMockCart({
        total_price: 15000, // $150.00
        items: [
          createMockLineItem({
            price: "150.00",
            line_price: "150.00",
          }),
        ],
      });

      manager.addChainEvent({ name: "addGift", action: addGiftIfOverThreshold });
      manager.addChainEvent({
        name: "updateAttributes",
        action: updateCartAttributesWithGiftId,
      });

      const result = await manager.startChainEvent(cart);

      expect(result).not.toBeNull();
      // Gift should be added
      expect(result!.items).toHaveLength(2);
      expect(result!.item_count).toBe(2);
      // Gift item should exist
      const giftItem = result!.items.find((item) => item.variant_id === GIFT_VARIANT_ID);
      expect(giftItem).toBeDefined();
      expect(giftItem!.price).toBe("0.00");
      expect(giftItem!.title).toBe("Free Gift");
      // Attributes should be updated with gift variant id
      expect(result!.attributes.gift_variant_id).toBe(String(GIFT_VARIANT_ID));
    });

    it("should execute events in correct order (async chain)", async () => {
      const executionOrder: string[] = [];

      const firstEvent: ChainEventAction = async (cart: ShopifyCart) => {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("addGift");

        if (cart.total_price > MINIMUM_AMOUNT_FOR_GIFT) {
          const giftItem = createGiftLineItem();
          return {
            ...cart,
            items: [...cart.items, giftItem],
            item_count: cart.item_count + 1,
          };
        }
        return cart;
      };

      const secondEvent: ChainEventAction = async (cart: ShopifyCart) => {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("updateAttributes");

        const giftItem = cart.items.find((item) => item.variant_id === GIFT_VARIANT_ID);
        if (giftItem) {
          return {
            ...cart,
            attributes: {
              ...cart.attributes,
              gift_variant_id: String(giftItem.variant_id),
            },
          };
        }
        return cart;
      };

      const cart = createMockCart({
        total_price: 15000, // $150.00
      });

      manager.addChainEvent({ name: "addGift", action: firstEvent });
      manager.addChainEvent({ name: "updateAttributes", action: secondEvent });

      const result = await manager.startChainEvent(cart);

      // Verify execution order
      expect(executionOrder).toEqual(["addGift", "updateAttributes"]);
      // Verify final result
      expect(result!.items).toHaveLength(2);
      expect(result!.attributes.gift_variant_id).toBe(String(GIFT_VARIANT_ID));
    });

    it("should NOT add duplicate gift if already exists", async () => {
      const existingGiftItem = createGiftLineItem();
      const cart = createMockCart({
        total_price: 15000, // $150.00
        items: [createMockLineItem(), existingGiftItem],
        item_count: 2,
      });

      manager.addChainEvent({ name: "addGift", action: addGiftIfOverThreshold });
      manager.addChainEvent({
        name: "updateAttributes",
        action: updateCartAttributesWithGiftId,
      });

      const result = await manager.startChainEvent(cart);

      expect(result).not.toBeNull();
      // Should still have only 2 items (no duplicate gift)
      expect(result!.items).toHaveLength(2);
      // Attributes should still be updated
      expect(result!.attributes.gift_variant_id).toBe(String(GIFT_VARIANT_ID));
    });

    it("should pass modified cart from first event to second event", async () => {
      let cartPassedToSecondEvent: ShopifyCart | null = null;

      const firstEvent: ChainEventAction = async (cart: ShopifyCart) => {
        if (cart.total_price > MINIMUM_AMOUNT_FOR_GIFT) {
          const giftItem = createGiftLineItem();
          return {
            ...cart,
            items: [...cart.items, giftItem],
            item_count: cart.item_count + 1,
          };
        }
        return cart;
      };

      const secondEvent: ChainEventAction = async (cart: ShopifyCart) => {
        cartPassedToSecondEvent = cart;
        const giftItem = cart.items.find((item) => item.variant_id === GIFT_VARIANT_ID);
        if (giftItem) {
          return {
            ...cart,
            attributes: {
              ...cart.attributes,
              gift_variant_id: String(giftItem.variant_id),
            },
          };
        }
        return cart;
      };

      const cart = createMockCart({
        total_price: 15000, // $150.00
        items: [createMockLineItem()],
        item_count: 1,
      });

      manager.addChainEvent({ name: "addGift", action: firstEvent });
      manager.addChainEvent({ name: "updateAttributes", action: secondEvent });

      await manager.startChainEvent(cart);

      // The cart passed to second event should have the gift item added by first event
      expect(cartPassedToSecondEvent).not.toBeNull();
      expect(cartPassedToSecondEvent!.items).toHaveLength(2);
      expect(cartPassedToSecondEvent!.item_count).toBe(2);
    });
  });

  describe("getCarts", () => {
    it("should return null before any chain event is executed", () => {
      expect(manager.getCarts()).toBeNull();
    });

    it("should return the final cart after chain events are executed", async () => {
      const cart = createMockCart({ total_price: 15000 });

      const mockAction: ChainEventAction = async (c) => ({
        ...c,
        note: "Processed",
      });

      manager.addChainEvent({ name: "process", action: mockAction });
      await manager.startChainEvent(cart);

      const result = manager.getCarts();
      expect(result).not.toBeNull();
      expect(result!.note).toBe("Processed");
    });

    it("should return null after chain event returns null", async () => {
      const cart = createMockCart();

      const nullAction: ChainEventAction = async () => null;
      manager.addChainEvent({ name: "nullEvent", action: nullAction });

      await manager.startChainEvent(cart);

      expect(manager.getCarts()).toBeNull();
    });
  });

  describe("executeEvent", () => {
    it("should execute a single event directly", async () => {
      const cart = createMockCart();
      const modifiedCart = { ...cart, note: "Direct execution" };

      const mockAction: ChainEventAction = async () => modifiedCart;

      const result = await manager.executeEvent(mockAction, cart);

      expect(result).toEqual(modifiedCart);
    });
  });
});
