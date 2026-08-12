import { Cashfree, CFEnvironment } from "cashfree-pg";

const clientId = process.env.CASHFREE_CLIENT_ID || "dummy";
const clientSecret = process.env.CASHFREE_CLIENT_SECRET || "dummy";

const environment = process.env.CASHFREE_ENVIRONMENT === "production" 
  ? CFEnvironment.PRODUCTION 
  : CFEnvironment.SANDBOX;

export const cashfree = new Cashfree(
  environment,
  clientId,
  clientSecret
);
