import { resolve, dirname } from "path";
import axios from "axios";
import getBaseUrl from "./getBaseUrl.js";
import getProductHandle from "./get_product_handle.js";
import sendWebhook from "./send_webhook.js";
import dotenv from "dotenv";
import isProductUrl from "./is_product_url.js";
import fs from "fs/promises";
import path from "path";

dotenv.config({ path: resolve("../../../../.env") });

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

/**
 * @description fastMode - Fetches product information and generates ATC links for each variant when AntiBot is not enabled.
 * @param {*} product_URL - The URL of the product page.
 * @returns
 */
export default async function fastMode(product_URL) {
  try {
    // Gathering and building url

    const baseURL = await getBaseUrl(product_URL);
    const isProductPage = isProductUrl(product_URL);

    if (!isProductPage) {
      const atcEndPoint = process.env.ATC_PRODUCT_END_POINT;
      console.log("Product url detected !");
      const handle = await getProductHandle(product_URL);
      const productJsonUrl = `${baseURL}/products/${handle}${atcEndPoint}`;

      // Fetching product data
      const response = await axios.get(productJsonUrl, {
        headers: safeHeaders,
        responseType: "json",
      });

      // processing product data
      const product = response.data.product;

      if (!product || !product.variants) {
        console.error("no product founded");
        return;
      }

      const atcLinks = product.variants.map((variant) => ({
        size: variant.title,
        atcLink: `${baseURL}/cart/${variant.id}:1`,
        price: variant.price,
      }));

      const imgUrl = product.image.src;
      const productTitle = product.title;

      console.log("fast Mode succeed !");

      // Sending webhook
      await sendWebhook(atcLinks, imgUrl, productTitle);
    } else {
      console.log("Main page url detected !");
      const atcMainPageEndPoint = process.env.ATC_MAIN_PAGE_END_POINT;
      const productJsonUrl = `${baseURL}/${atcMainPageEndPoint}`;

      console.log("productJsonUrl : ", productJsonUrl);

      // Fetching product data
      const response = await axios.get(productJsonUrl, {
        headers: safeHeaders,
        responseType: "json",
      });

      // processing product data

      const products = response.data.products;

      console.log("product : ", products);

      console.log("File written successfully to ", filePath);

      for (const product of products) {
        try {
          console.log("product : ", product);
          const atcLinks = product.variants
            .filter((variant) => variant.available)
            .map((variant) => ({
              size: variant.title,
              atcLink: `${baseURL}/cart/${variant.id}:1`,
              price: variant.price,
            }));

          const imgUrl = product.images[0]?.src || "";
          const productTitle = product.title;

          await sendWebhook(atcLinks, imgUrl, productTitle);
        } catch (error) {
          console.error("Error processing products variants: ", error);
        }
      }
    }
  } catch (error) {
    console.error("\t Error in fastMode");
    throw error;
  }
}
