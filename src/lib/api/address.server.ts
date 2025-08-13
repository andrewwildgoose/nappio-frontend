import { BACKEND_API_URL } from '$env/static/private';

export async function addAddress(address: any, jwt: string | undefined) {
    console.log('Adding address:', address, 'with JWT:', jwt);
    const response = await fetch(`${BACKEND_API_URL}/api/v1/user/add-address`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(address)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to add address');
    return data;
}

export async function assignAddress(addressId: string, subscriptionId: string, jwt: string | undefined) {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/user/assign-subscription-address`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ address_id: addressId, subscription_id: subscriptionId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to assign address');
    return data;
}