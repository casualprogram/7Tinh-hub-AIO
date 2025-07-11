import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import getBaseUrl from "./getBaseUrl.js";
import getProductHandle from "./get_product_handle.js";
import { resolve } from "path";
import sendWebhook from "./send_webhook.js";
import dotenv from "dotenv";
import isProductUrl from "./is_product_url.js";

puppeteer.use(StealthPlugin());

dotenv.config({ path: resolve("../../../../.env") });

const safeHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en-US,en;q=0.9",
  "sec-fetch-site": "none",
  "sec-fetch-mode": "navigate",
  "sec-fetch-dest": "document",
};

/**
 * @description normalMode - Fetches product information and generates ATC links for each variant when AntiBot is enabled.
 * @param {} productUrl - The URL of the product page.
 */

export default async function normalMode(productUrl) {
  // Gathering and building url
  let browser;
  const atcEndPoint = process.env.ATC_PRODUCT_END_POINT;
  const baseUrl = await getBaseUrl(productUrl);
  const isProductPage = await isProductUrl(productUrl);

  if (isProductPage) {
    try {
      const productHandle = await getProductHandle(productUrl);
      if (!productHandle) {
        throw new Error("No product handle found in URL");
      }
      const productJsonUrl = `${baseUrl}/products/${productHandle}${atcEndPoint}`;

      console.log("\tTrying normalMode");

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Improve stability
      });

      const page = await browser.newPage();

      await page.setUserAgent(safeHeaders["user-agent"]);
      await page.setExtraHTTPHeaders({
        accept: safeHeaders.accept,
        "accept-language": safeHeaders["accept-language"],
        "sec-fetch-site": safeHeaders["sec-fetch-site"],
        "sec-fetch-mode": safeHeaders["sec-fetch-mode"],
        "sec-fetch-dest": safeHeaders["sec-fetch-dest"],
      });

      await page.goto(productJsonUrl, {
        waitUntil: "networkidle2",
        timeout: 60000, // Increase timeout to 60s
      });

      // Wait for the JSON data to load
      const content = await page.content();

      // processing product data
      const jsonMatch = content.match(/<pre[^>]*>(.*?)<\/pre>/s);
      if (!jsonMatch || !jsonMatch[1]) {
        throw new Error("No JSON data found on the page");
      }

      let productData;
      try {
        productData = JSON.parse(jsonMatch[1]);
      } catch (error) {
        throw new Error(`Failed to parse JSON data: ${error.message}`);
      }

      const product = productData.product;
      if (!product || !product.variants) {
        throw new Error("No product or variants found");
      }

      const atcLinks = product.variants.map((variant) => ({
        size: variant.title,
        atcLink: `${baseUrl}/cart/${variant.id}:1`,
        price: variant.price,
      }));

      const imgUrl = product.images[0]?.src || "";
      const productTitle = product.title || "Unknown Product";

      // Sending webhook msg
      await sendWebhook(atcLinks, imgUrl, productTitle);
    } catch (error) {
      console.error("Error in normalMode:", {
        message: error.message,
      });
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  } else {
    console.log("Main Page URL detected");

    const atcMainPageEndPoint = process.env.ATC_MAIN_PAGE_END_POINT;
    const productJsonUrl = `${baseUrl}/${atcMainPageEndPoint}`;

    try {
      console.log("\tTrying normalMode");

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Improve stability
      });

      const page = await browser.newPage();

      await page.setUserAgent(safeHeaders["user-agent"]);
      await page.setExtraHTTPHeaders({
        accept: safeHeaders.accept,
        "accept-language": safeHeaders["accept-language"],
        "sec-fetch-site": safeHeaders["sec-fetch-site"],
        "sec-fetch-mode": safeHeaders["sec-fetch-mode"],
        "sec-fetch-dest": safeHeaders["sec-fetch-dest"],
      });

      await page.goto(productJsonUrl, {
        waitUntil: "networkidle2",
        timeout: 60000, // Increase timeout to 60s
      });

      // Wait for the JSON data to load
      const content = await page.content();

      // processing product data
      const jsonMatch = content.match(/<pre[^>]*>(.*?)<\/pre>/s);
      if (!jsonMatch || !jsonMatch[1]) {
        throw new Error("No JSON data found on the page");
      }

      let productData;
      try {
        productData = JSON.parse(jsonMatch[1]);
      } catch (error) {
        throw new Error(`Failed to parse JSON data: ${error.message}`);
      }

      const products = productData.products;

      for (const product of products) {
        try {
          if (!products || products.variants) {
            throw new Error("No product or variants found");
          }
          const atcLinks = product.variants
            .filter((variant) => variant.available)
            .map((variant) => ({
              size: variant.title,
              atcLink: `${baseUrl}/cart/${variant.id}:1`,
              price: variant.price,
            }));

          const imgUrl = product.images[0]?.src || "";
          const productTitle = product.title || "Unknown Product";
          // Sending webhook msg

          await sendWebhook(atcLinks, imgUrl, productTitle);
        } catch (error) {
          console.error("Error processing products variants: ", error.message);
        }
      }
    } catch (error) {
      console.error("Error in normalMode MainPage:", {
        message: error.message,
      });
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
