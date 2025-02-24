import fs from 'fs/promises';
import { resolve } from 'path';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config({ path: resolve('../../.env') });

import delay from '../helper/delay.js';
const SOURCE_URL = process.env.SOURCE_1;

import path from 'path';

const filePath = path.resolve("../data/source1/stories.json");

export default async function getFirstData() {
    try{
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized"],
            ignoreHTTPSErrors: true
        });
        
       
        console.log("delay successfully");
        const page = await browser.newPage();
        
        await page.goto(SOURCE_URL, {
            waitUntil: "load",
            timeout: 60000
        });
        
        console.log("Page has been loaded successfully");


        // load lazy contet
        await autoScroll(page);
        console.log("Page has been scrolled successfully");

        await page.waitForSelector('.megaFeedCard');
        console.log("Page has been loaded successfully");

        await delay(5000);

        const scrapedData = await page.evaluate(() => {
            const cards = document.querySelectorAll('.megaFeedCard');
            return Array.from(cards).map(card => {
                const detailsLink = card.querySelector('.megaFeedCardDetails');
                const imageContainer = card.querySelector('.megaFeedCardImageContainer img');
                const headline = card.querySelector('.megaFeedCardHeadline');
                const timestamp = card.querySelector('.megaFeedCardPublishedAt');

                return {
                    postUrl: detailsLink ? detailsLink.href : 'N/A',
                    pictureUrl: imageContainer ? imageContainer.src : 'N/A',
                    headline: headline ? headline.textContent.trim() : 'N/A',
                    timestamp: timestamp ? timestamp.textContent.trim() : 'N/A'
                };
            });
        });

        await fs.writeFile(filePath, JSON.stringify(scrapedData, null, 2)), {encoding: "utf-8"};
        console.log("Data has been scraped and saved successfully");

        await browser.close();
        return scrapedData;

    } catch(e){
        console.log("Error at source 1: ", e);
    }
}




// Auto-scroll function
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise(resolve => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

