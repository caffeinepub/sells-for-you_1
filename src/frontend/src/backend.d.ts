import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    user: Principal;
    totalAmount: bigint;
    timestamp: bigint;
    items: Array<CartItem>;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    image: string;
    price: bigint;
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, image: string): Promise<bigint>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    checkout(): Promise<bigint>;
    getAllProducts(): Promise<Array<Product>>;
    getCart(): Promise<Array<CartItem>>;
    getOrder(orderId: bigint): Promise<Order>;
    getProduct(productId: bigint): Promise<Product>;
    removeFromCart(productId: bigint): Promise<void>;
}
