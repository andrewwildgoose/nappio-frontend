export interface AddressFormData {
	error: string;
	message: string;
	address_line_1: string;
	address_line_2?: string;
	city: string;
	country: string;
	postcode: string;
	address_notes?: string;
	success?: boolean;
	data?: {
		success: boolean;
		message?: string;
	};
}

export interface UserAddress {
	id: string;
	user_id: string;
	address_line_1: string;
	address_line_2?: string;
	city: string;
	postcode: string;
	country: string;
	address_notes?: string;
	created_at?: string;
	updated_at?: string;
}
