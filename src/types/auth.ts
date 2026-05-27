export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    full_name: string;
    email: string;
    mobile_number: string;
    password: string;
    password_confirmation: string;
    business_name: string;
    business_address: string;
    business_email: string;
    business_phone: string;
    br_number: string;
}
