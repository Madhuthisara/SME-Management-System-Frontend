export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    PROFILE: {
        GET: '/profile',
        UPDATE_PERSONAL: '/profile/personal',
        UPDATE_COMPANY: '/profile/company',
        CHANGE_PASSWORD: '/profile/password',
    },
    ATTRIBUTES: {
        CREATE: '/attributes/create',
        UPDATE: '/attributes/update',
        DELETE: '/attributes/delete',
        ALL: '/attributes/all',
        OPTIONS: {
            CREATE: '/attributes/options/create',
            UPDATE: '/attributes/options/update',
            DELETE: '/attributes/options/delete',
            ALL: '/attributes/options/all',
        }
    },
    MATERIALS: {
        CREATE: '/materials/create',
        UPDATE: '/materials/update',
        DELETE: '/materials/delete',
        ALL: '/materials/all',
    },
    MATERIAL_STOCKS: {
        CREATE: '/material-stocks/create',
        UPDATE: '/material-stocks/update',
        DELETE: '/material-stocks/delete',
        ALL: '/material-stocks/all',
    },
    CATEGORIES: {
        CREATE: '/categories/create',
        UPDATE: '/categories/update',
        DELETE: '/categories/delete',
        ALL: '/categories/all',
    },
    PRODUCT_TEMPLATES: {
        CREATE: '/product-templates/create',
        UPDATE: '/product-templates/update',
        DELETE: '/product-templates/delete',
        ALL: '/product-templates/all',
    },
    PRODUCT_STOCKS: {
        CREATE: '/product-stocks/create',
        DELETE: '/product-stocks/delete',
        ALL: '/product-stocks/all',
    },
    PRODUCTS: {
        CREATE: '/products/create',
        UPDATE: '/products/update',
        DELETE: '/products/delete',
        ALL: '/products/all',
        VARIANTS: (id: string) => `/products/${id}/variants`,
        REQUIRED_ATTRIBUTES: (id: string) => `/products/${id}/required-attributes`,
    },
    ORDERS: {
        CREATE: '/orders/create',
        UPDATE_STATUS: '/orders/update-status',
        DELETE: '/orders/delete',
        ALL: '/orders/all',
        GET_ONE: '/orders/get',
    },
    ORDER_STATUSES: {
        ALL: '/order-statuses/all',
        CREATE: '/order-statuses/create',
        UPDATE: '/order-statuses/update',
        DELETE: '/order-statuses/delete',
    },
    HEROES: {
        ALL: '/heroes',
        CREATE: '/heroes/create',
        UPDATE: (id: string | number) => `/heroes/update/${id}`,
        DELETE: (id: string | number) => `/heroes/delete/${id}`,
    },
    MEDIA: {
        UPLOAD: '/media/upload',
    },
    PAYMENT_SETTINGS: {
        ALL: '/payment-settings',
        SAVE: '/payment-settings/save',
        TOGGLE: (id: string) => `/payment-settings/${id}/toggle`,
        DELETE: (id: string) => `/payment-settings/${id}`,
    },
    PAYMENTS: {
        METHODS: (businessId: string) => `/payments/methods/${businessId}`,
        INITIATE: '/payments/initiate',
        VERIFY: '/payments/verify',
    },
    HEALTH: '/health',
    DASHBOARD: {
        STATS: '/dashboard/stats',
    },
};

