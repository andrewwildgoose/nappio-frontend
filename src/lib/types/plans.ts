export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    stripe_link: string;
    stripe_price_id: string | null;
    active: boolean;
    sort_order: number;
}