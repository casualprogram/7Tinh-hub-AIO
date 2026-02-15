import path, { resolve } from 'path';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import sendWebhook from '../discord_msg/news_notify.js';
dotenv.config({ path: resolve('../../../../.env') });

puppeteer.use(StealthPlugin());

function decodeHtmlEntities(str) {
    return str
        .replace(/&#8217;/g, "'")
        .replace(/&#8216;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—')
        .replace(/&#038;/g, '&')
        .replace(/&amp;/g, '&');
}

/**
 * @description - This function is responsible for fetching the data from the source.
 */
export default async function getThirdData(){
    try{
        const SOURCE_URL_3 = process.env.SOURCE_3;
        const filePath = path.resolve('src/data/source1/stories3.json');

        // Launch browser with stealth to bypass Cloudflare
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized", "--no-sandbox"],
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();
        await page.goto(SOURCE_URL_3, {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        // Wait for Cloudflare challenge to resolve — keep checking until body contains valid JSON
        let jsonData = null;
        for (let attempt = 0; attempt < 10; attempt++) {
            const bodyText = await page.evaluate(() => document.body.innerText);
            console.log(`[DEBUG] Attempt ${attempt + 1} - body preview: ${bodyText.substring(0, 100)}`);
            try {
                jsonData = JSON.parse(bodyText);
                if (jsonData && jsonData.data) break;
            } catch {
                // Not JSON yet, Cloudflare challenge likely still active
            }
            await new Promise(r => setTimeout(r, 3000));
            // Reload if stuck on challenge page
            if (attempt > 0) {
                await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
            }
        }

        if (!jsonData || !jsonData.data) {
            await browser.close();
            console.log("Failed to fetch data from source 3 - no valid JSON returned.");
            return;
        }

        const filteredData = jsonData.data
        .filter(item => !item.time.includes('day ago'))
        .map(item => ({
            title: decodeHtmlEntities(item.title || "N/A"),
            postUrl: item.post_link || "N/A",
            imageUrl: (item.image || "N/A").split('?')[0],
        }));

        console.log("filteredData is : ", filteredData);

        // Download images through the authenticated Puppeteer session (bypasses Cloudflare)
        const imageBuffers = [];
        for (const item of filteredData) {
            try {
                const response = await page.evaluate(async (url) => {
                    const res = await fetch(url);
                    const buffer = await res.arrayBuffer();
                    return Array.from(new Uint8Array(buffer));
                }, item.imageUrl);
                imageBuffers.push(Buffer.from(response));
                console.log(`[DEBUG] Downloaded image for: ${item.title}`);
            } catch (e) {
                console.log(`[DEBUG] Failed to download image for: ${item.title}`, e.message);
                imageBuffers.push(null);
            }
        }

        await browser.close();

        try{
            for (let i = 0; i < filteredData.length; i++) {
                await sendWebhook(filteredData[i].title, filteredData[i].imageUrl, filteredData[i].postUrl, imageBuffers[i]);
            }
        }catch(e){
            console.log("Error at sending webhook source 3\n Contact Devs team \n", e);
        }

        // Write the data to the file system
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');

    } catch(e){
        console.log("Error at source 3 scrapping\n Contact Devs team \n", e);
    }
}
