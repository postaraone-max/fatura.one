export type Plan = {
  name: string;
  price: number | null;
  features?: string[];
};

export type PricingConfig = {
  currency: string;
  plans: Plan[];
};

const config: PricingConfig = {
  currency: "IQD",
  plans: [
    { name: "free", price: 0, features: ["10 invoices per month"] },
    { name: "pro", price: 9900, features: ["Unlimited invoices"] },
  ],
};

export function getPricing(): PricingConfig {
  return config;
}

export function getPlanByName(name: string): Plan | null {
  return config.plans.find(p => p.name.toLowerCase() === name.toLowerCase()) ?? null;
}