import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import getBaseUrl from "../utilities/getBaseUrl.js";
import getProductHandle from "../utilities/get_product_handle.js";

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";
const safeHeaders = {
  pragma: "no-cache",
  "cache-control": "no-cache",
  "upgrade-insecure-requests": "1",
  "user-agent": userAgent,
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "sec-fetch-site": "none",
  "sec-fetch-mode": "navigate",
  "sec-fetch-user": "?1",
  "sec-fetch-dest": "document",
  "accept-language": "en-US,en;q=0.9",
};

async function fastMode(product_URL) {
  try {
    const baseURLL = await getBaseUrl(product_URL);
    console.log("Base URL: ", baseURLL);
    const handle = await getProductHandle(product_URL);
    console.log("Product Handle: ", handle);

    const productJsonUrl = `${baseURLL}/products/${handle}`;

    const response = await axios.get(productJsonUrl, {
      headers: safeHeaders,
      responseType: "json",
    });

    const product = response.data.product;

    if (!product || !product.variants) {
      console.error("no product founded");
      return;
    }

    const atcLinks = product.variants.map((variant) => ({
      size: variant.title,
      atcLink: `${baseURLL}/cart/${variant.id}:1`,
    }));

    console.log("fast Mode succeed !");
    console.log("ATC Links: ", atcLinks);
  } catch (error) {
    console.error("Error in fast mode:", error);
  }
}
fastMode(product_URL);
