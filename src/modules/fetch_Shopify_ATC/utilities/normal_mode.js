import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import getBaseUrl from "./getBaseUrl.js";
import getProductHandle from "./get_product_handle.js";
import fs from "fs/promises";
import { resolve } from "path";
import sendWebhook from "./send_webhook.js";
import dotenv from "dotenv";

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

export default async function normalMode(productUrl) {
  let browser;
  const atcEndPoint = process.env.ATC_PRODUCT_END_POINT;

  try {
    const baseUrl = await getBaseUrl(productUrl);
    const productHandle = await getProductHandle(productUrl);
    if (!productHandle) {
      throw new Error("No product handle found in URL");
    }
    const productJsonUrl = `${baseUrl}/products/${productHandle}${atcEndPoint}`;

    console.log("FINAL URL:", productJsonUrl);
    console.log("Trying normalMode");

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

    const content = await page.content();
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

    console.log("normalMode succeeded! ATC Links:", atcLinks);
    console.log("Image URL:", imgUrl);
    console.log("DONE");

    await sendWebhook(atcLinks, imgUrl, productTitle);
  } catch (error) {
    console.error("Error in normalMode:", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
