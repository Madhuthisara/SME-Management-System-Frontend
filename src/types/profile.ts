export interface Business {
    id: string | number;
    business_name: string;
    business_address: string;
    website: string | null;
    business_email: string;
    business_phone: string;
    tax_id: string | null;
    br_number: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string | number;
    full_name: string;
    email: string;
    mobile_number: string;
    business_id: string | number;
    created_at: string;
    updated_at: string;
    business: Business;
}

export interface ProfileData {
    user: User;
    business: Business;
}

export interface ProfileResponse {
    message: string;
    output: ProfileData;
}

export interface UpdatePersonalPayload {
    full_name: string;
    email: string;
    mobile_number: string;
}

export interface UpdateCompanyPayload {
    business_name: string;
    business_email: string;
    business_phone: string;
    business_address: string;
    tax_id: string | null;
    website: string | null;
    br_number: string;
}

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}
