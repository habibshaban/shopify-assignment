export interface ShopifyMoney {
  amount: string;
  currency_code: string;
}

export interface ShopifyImage {
  url: string;
  alt_text: string | null;
  width: number;
  height: number;
}

export interface ShopifyProductVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string | null;
  grams: number;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
  image_id: number | null;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  published_scope: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: ShopifyProductVariant[];
  options: ShopifyProductOption[];
  images: ShopifyImage[];
  image: ShopifyImage | null;
}

export interface ShopifyProductOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyDiscountAllocation {
  amount: string;
  discount_application_index: number;
  amount_set: {
    shop_money: ShopifyMoney;
    presentment_money: ShopifyMoney;
  };
}

export interface ShopifyLineItemProperty {
  name: string;
  value: string;
}

export interface ShopifyLineItem {
  id: number;
  key: string;
  product_id: number;
  variant_id: number;
  sku: string;
  vendor: string;
  title: string;
  variant_title: string | null;
  image_url: string | null;
  taxable: boolean;
  requires_shipping: boolean;
  gift_card: boolean;
  price: string;
  compare_at_price: string | null;
  line_price: string;
  original_line_price: string;
  total_discount: string;
  discounts: ShopifyDiscountAllocation[];
  discount_allocations: ShopifyDiscountAllocation[];
  grams: number;
  quantity: number;
  fulfillment_service: string;
  properties: ShopifyLineItemProperty[];
  product_has_only_default_variant: boolean;
  product_title: string;
  product_description: string;
  product_type: string;
  handle: string;
  url: string;
  featured_image: ShopifyImage | null;
  options_with_values: {
    name: string;
    value: string;
  }[];
  final_line_price: string;
  final_price: string;
  original_price: string;
  unit_price: string | null;
  unit_price_measurement: {
    measured_type: string | null;
    quantity_value: number | null;
    quantity_unit: string | null;
    reference_value: number | null;
    reference_unit: string | null;
  } | null;
}

export interface ShopifyCart {
  token: string;
  note: string | null;
  attributes: Record<string, string>;
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: ShopifyLineItem[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: {
    type: string;
    key: string;
    title: string;
    description: string;
    value: string;
    created_at: string;
    value_type: string;
    allocation_method: string;
    target_selection: string;
    target_type: string;
    total_allocated_amount: number;
  }[];
}

export type ChainEventAction = (
  cart: ShopifyCart
) => Promise<ShopifyCart | null> | ShopifyCart | null;

export interface ChainEvent {
  name: string;
  action: ChainEventAction;
}
