import { backendFetch } from '$lib/server/backend';

export async function addAddress(address: any, jwt: string | undefined) {
	const response = await backendFetch(`/api/v1/user/addresses`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${jwt}`
		},
		body: JSON.stringify(address)
	});
	const data = await response.json();
	if (!response.ok) throw new Error(data.detail || 'Failed to add address');
	return data;
}

export async function assignAddress(
	addressId: string,
	subscriptionId: string,
	jwt: string | undefined
) {
	const response = await backendFetch(`/api/v1/user/subscription-address`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${jwt}`
		},
		body: JSON.stringify({ address_id: addressId, subscription_id: subscriptionId })
	});
	const data = await response.json();
	if (!response.ok) throw new Error(data.detail || 'Failed to assign address');
	return data;
}
