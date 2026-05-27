import { Product } from './product';

export interface CustomOrderStatus {
    id: string;
    name: string;
    color: string;
}

export enum OrderSource {
    WHATSAPP = 'whatsapp',
    FACEBOOK = 'facebook',
    INSTAGRAM = 'instagram',
    TIKTOK = 'tiktok',
    WALK_IN = 'walk_in',
    OTHER = 'other'
}

export enum OrderStatus {
    NEW = 'new',
    PROCESSING = 'processing',
    DELIVERED = 'delivered',
    REJECTED = 'rejected',
    RETURNED = 'returned',
    EXCHANGED = 'exchanged'
}

export enum PaymentMethod {
    COD = 'cod',
    BANK_TRANSFER = 'bank_transfer',
    ONLINE = 'online_payment',
    KOKO = 'koko'
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: string;
    total_price: string;
    product?: Product;
    selected_attributes?: {
        attribute_name: string;
        option_name: string;
        option_id: string;
    }[];
}

export interface Order {
    id: string;
    business_id: string;
    customer_name: string;
    phone_number: string;
    secondary_phone_number?: string;
    delivery_address: string;
    district: string;
    nearest_main_city: string;
    source: OrderSource;
    status: OrderStatus;
    payment_method: PaymentMethod;
    total_amount: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
    custom_status?: CustomOrderStatus | null;
    custom_status_id?: string | null;
}

export interface CreateOrderPayload {
    customer_name: string;
    phone_number: string;
    secondary_phone_number?: string;
    delivery_address: string;
    district: string;
    nearest_main_city: string;
    source: OrderSource;
    payment_method: PaymentMethod;
    notes?: string;
    items: {
        product_id: string;
        attribute_option_ids?: string[];
        quantity: number;
        unit_price: number;
    }[];
    custom_status_id?: string;
}

export interface UpdateOrderStatusPayload {
    status?: OrderStatus;
    custom_status_id?: string | null;
    notes?: string;
}

import { PaginatedData } from './pagination';

export interface OrdersListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<Order>;
}

export interface OrderResponse {
    success: boolean;
    message: string;
    output: Order;
}
