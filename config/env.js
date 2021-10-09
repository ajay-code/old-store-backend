import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI;
export const SECRET = process.env.SECRET;
export const BRAINTREE_MERCHANT_ID = process.env.BRAINTREE_MERCHANT_ID;
export const BRAINTREE_PUBLIC_KEY = process.env.BRAINTREE_PUBLIC_KEY;
export const BRAINTREE_PRIVATE_KEY = process.env.BRAINTREE_PRIVATE_KEY;
