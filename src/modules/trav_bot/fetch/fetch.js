import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import sendWebhook from "./send_webhook/send_webhook.js";
import sendFailWebhook from "./send_webhook/send_false_webhook.js";

puppeteer.use(StealthPlugin());

const safeHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
};

export default async function fetchCactusJack() {
  let browser;
  try {
    let productUrl = "https://shop.travisscott.com/";
    console.log("\tFetching Travis Data");

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(safeHeaders["user-agent"]);
    await page.setExtraHTTPHeaders({
      accept: safeHeaders.accept,
      "accept-language": safeHeaders["accept-language"],
    });

    await page.goto(productUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // ────────  1. Raffle JSON  ────────
    const raffleData = await page.evaluate(() => {
      const script = document.querySelector(
        'script[type="application/json"][data-raffle-data]'
      );
      if (!script) return null;
      try {
        return JSON.parse(script.textContent);
      } catch (e) {
        console.error("Raffle JSON parse error:", e);
        return null;
      }
    });

    const raffleStatus = raffleData?.raffleStatus?.toLowerCase() ?? "unknown";
    const isRaffleOpen = raffleStatus !== "closed";
    console.log(`\tRaffle Status: ${isRaffleOpen}`);

    // ────────  2. First product image  ────────
    const firstImage = await page.evaluate(() => {
      // 1. Try the inline background-image (most reliable)
      const bgCell = document.querySelector(
        '.P__img-cell-0[style*="background-image"]'
      );
      if (bgCell) {
        const match = bgCell.style.backgroundImage.match(
          /url\(['"]?([^'"]+)['"]?\)/
        );
        return match ? match[1] : null;
      }

      // 2. Fallback: <img> inside the first cell
      const img = document.querySelector(".P__img-cell-0 img.P__img");
      if (img?.src) return img.src;

      // 3. Fallback: any .P__img-cell with data-zoom-src
      const zoom = document.querySelector(".P__img-cell[data-zoom-src]");
      return zoom?.dataset?.zoomSrc ?? null;
    });

    // Make the URL absolute (Shopify often uses //cdn.shopify.com/…)
    const absoluteImage = firstImage
      ? firstImage.startsWith("http")
        ? firstImage
        : `https:${firstImage}`
      : null;
    if (isRaffleOpen) {
      console.log("\tRaffle is OPEN!");
      sendWebhook(absoluteImage, productUrl);
    } else {
      sendFailWebhook(raffleStatus);
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
