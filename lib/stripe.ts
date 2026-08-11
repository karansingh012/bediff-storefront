import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
}

// Ensure you are using the correct API version for the installed stripe package.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-07-29.dahlia", // Adjust this if TypeScript complains about the version.
  appInfo: {
    name: "BEDIFF Storefront",
  },
});
