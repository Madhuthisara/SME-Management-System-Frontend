import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';

// ─── Types ───────────────────────────────────────────────────────────────────

export type GatewayName = 'stripe' | 'paypal' | 'payhere';
export type Environment = 'sandbox' | 'production';

export interface PaymentSettingCredentials {
    // Stripe
    secret_key?: string;
    publishable_key?: string;
    webhook_secret?: string;
    // PayPal
    client_id?: string;
    client_secret?: string;
    // PayHere
    merchant_id?: string;
    merchant_secret?: string;
    app_id?: string;
    app_secret?: string;
}

export interface PaymentSetting {
    id: string;
    gateway_name: GatewayName;
    is_active: boolean;
    display_order: number;
    environment: Environment;
    credentials: PaymentSettingCredentials; // Values are masked in GET responses
    created_at: string;
    updated_at: string;
}

export interface SavePaymentSettingPayload {
    business_id: string;
    gateway_name: GatewayName;
    credentials: PaymentSettingCredentials;
    is_active?: boolean;
    display_order?: number;
    environment?: Environment;
}

export interface ActivePaymentMethod {
    gateway_name: GatewayName;
    display_name: string;
    logo_url: string;
    display_order: number;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Get all gateway configurations for a business (admin, credentials masked).
 */
export const getPaymentSettings = (businessId: string) =>
    axiosInstance.get<{ output: PaymentSetting[] }>(API_ENDPOINTS.PAYMENT_SETTINGS.ALL, {
        params: { business_id: businessId },
    });

/**
 * Save (create or update) a gateway's configuration.
 * Pass only the credential keys you want to update; others keep existing values on backend.
 */
export const savePaymentSettings = (payload: SavePaymentSettingPayload) =>
    axiosInstance.post(API_ENDPOINTS.PAYMENT_SETTINGS.SAVE, payload);

/**
 * Toggle the is_active flag of a specific gateway.
 */
export const togglePaymentGateway = (id: string) =>
    axiosInstance.patch(API_ENDPOINTS.PAYMENT_SETTINGS.TOGGLE(id));

/**
 * Remove a gateway configuration.
 */
export const deletePaymentSetting = (id: string) =>
    axiosInstance.delete(API_ENDPOINTS.PAYMENT_SETTINGS.DELETE(id));

/**
 * PUBLIC — get active gateways for a business (no credentials, used by checkout).
 */
export const getActiveMethods = (businessId: string) =>
    axiosInstance.get<{ output: ActivePaymentMethod[] }>(
        API_ENDPOINTS.PAYMENTS.METHODS(businessId)
    );
