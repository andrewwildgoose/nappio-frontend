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
