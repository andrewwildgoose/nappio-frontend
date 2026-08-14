export async function fetchServiceAreaPostcodes(fetchFn: typeof fetch): Promise<string[]> {
    const res = await fetchFn('/api/service-areas', { method: 'GET' });
    if (!res.ok) return [];

    const payload = await res.json();

    // Adjust these keys to your backend response shape
    const rawList = Array.isArray(payload.postcode_prefixes)
        ? payload.postcode_prefixes
        : [];

    return rawList
        .map((item: any) => {
        if (typeof item === 'string') return item;
        return item.postcode_prefix ?? item.postcode ?? item.code ?? '';
    })
    .filter(Boolean)
    .map((pc: string) => pc.replace(/\s+/g, '').toUpperCase());
}