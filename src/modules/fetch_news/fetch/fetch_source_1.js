import fs from 'fs/promises';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import delay from '../../module_util/delay.js';
import autoScroll from '../../module_util/auto_scroll.js';
import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: resolve('../../../../.env') });
import sendWebhook from '../discord_msg/news_notify.js';

const LAST_SEEN_PATH = path.resolve('src/data/source1/last_seen_src1.json');

async function getLastSeenUrl() {
    try {
        const data = await fs.readFile(LAST_SEEN_PATH, 'utf-8');
        return JSON.parse(data).lastSeenUrl || '';
    } catch {
        return '';
    }
}

async function saveLastSeenUrl(url) {
    await fs.writeFile(LAST_SEEN_PATH, JSON.stringify({ lastSeenUrl: url }, null, 2), 'utf-8');
}

/**
 * @description - This function is responsible for fetching the data from the source.
 * @param {*} filePath  - The path to the file where the data will be stored.
 * @param {*} SOURCE_URL  - The URL of the source.
 * @returns
 */
export default async function getFirstData() {
    const SOURCE_URL = process.env.SOURCE_1;
    try{
        const lastSeenUrl = await getLastSeenUrl();

        // Launch the browser
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized"],
            ignoreHTTPSErrors: true
        });
        // Open a new page
        const page = await browser.newPage();
        // Go to the source URL
        await page.goto(SOURCE_URL, {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        // Wait for React to hydrate and render the cards
        await page.waitForSelector('.megaFeedCardRoot', { timeout: 30000 });

        // load lazy content
        await autoScroll(page);

        await delay(5000);
        // Scrape the data
        const scrapedData = await page.evaluate(() => {
            const cards = document.querySelectorAll('.megaFeedCardRoot');
            return Array.from(cards).map(card => {
                const linkEl = card.querySelector('a[href]');
                const imgEl = card.querySelector('picture img');
                const headlineEl = card.querySelector('p');

                return {
                    postUrl: linkEl ? linkEl.href : 'N/A',
                    pictureUrl: imgEl ? imgEl.src : 'N/A',
                    headline: headlineEl ? headlineEl.textContent.trim() : 'N/A',
                };
            });
        });

        // Close the browser
        await browser.close();
        console.log("Scraped data is : ", scrapedData);

        if (scrapedData.length === 0) {
            console.log("No articles found from source 1.");
            return;
        }

        // Save the newest article URL as the new last seen
        await saveLastSeenUrl(scrapedData[0].postUrl);

        // Send only new articles (stop when we hit the last seen URL)
        for (let i = 0; i < scrapedData.length; i++) {
            if (scrapedData[i].postUrl === lastSeenUrl) {
                console.log(`Reached last seen article at index ${i}, stopping.`);
                break;
            }
            await delay(500);
            const headline = scrapedData[i].headline;
            const imageURL = scrapedData[i].pictureUrl;
            const postUrl = scrapedData[i].postUrl;
            await sendWebhook(headline, imageURL, postUrl);
        }

    } catch(e){
        console.log("Error at source 1 scrapping\n Contact Devs team \n", e);
    }
}
