export interface VoucherVerificationResult {
	eligible: boolean;
	message: string;
	code?: string | null;
	postcode?: string | null;
	discount_code?: string | null;
	voucher_type?: string | null;
	failure_reason?:
		| 'not_found'
		| 'already_used'
		| 'postcode_mismatch'
		| 'unavailable'
		| 'service_error'
		| null;
}

export interface AppliedVoucher {
	code: string;
	postcode: string;
	discount_code: string;
	voucher_type: string;
}
