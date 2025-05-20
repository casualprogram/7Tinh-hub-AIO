import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url)); // Get current directory

// Resolve the path to your .env file
const envPath = resolve(__dirname, "../../../../../.env");

dotenv.config({ path: envPath });

const product_URL = "";
export default async function fetchATC(product_URL) {}
