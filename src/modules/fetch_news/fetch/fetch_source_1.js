import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import delay from '../../module_util/delay.js';
import autoScroll from '../helper/auto_scroll.js';


/**
 * @description - This function is responsible for fetching the data from the source.
 * @param {*} filePath  - The path to the file where the data will be stored.
 * @param {*} SOURCE_URL  - The URL of the source. 
 * @returns 
 */
export default async function getFirstData(filePath, SOURCE_URL) {
    try{
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
            waitUntil: "load",
            timeout: 60000
        });

        // load lazy contet
        await autoScroll(page);
        // Wait for the page to load
        await page.waitForSelector('.megaFeedCard');

        await delay(5000);
        // Scrape the data
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
        // Write the data to the file system
        await fs.writeFile(filePath, JSON.stringify(scrapedData, null, 2)), {encoding: "utf-8"};
        // Close the browser
        await browser.close();
        return scrapedData;

    } catch(e){
        console.log("Error at source 1 scrapping\n Contact Devs team \n", e);
    }
}