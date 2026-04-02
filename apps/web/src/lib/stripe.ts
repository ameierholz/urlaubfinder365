import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

export const STRIPE_PLATFORM_FEE_PERCENT = 15; // 15% Provision

/** Berechnet die Stripe application_fee in Cent (15%) */
export function calcApplicationFee(gesamtpreisEuro: number): number {
  return Math.round(gesamtpreisEuro * 100 * (STRIPE_PLATFORM_FEE_PERCENT / 100));
}
