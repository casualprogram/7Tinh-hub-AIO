import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import delay from '../helper/delay.js';
import autoScroll from '../helper/auto_scroll.js';


export default async function getFirstData(filePath, SOURCE_URL) {
    try{
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized"],
            ignoreHTTPSErrors: true
        });
        
       
        
        const page = await browser.newPage();
        
        await page.goto(SOURCE_URL, {
            waitUntil: "load",
            timeout: 60000
        });

        // load lazy contet
        await autoScroll(page);


        await page.waitForSelector('.megaFeedCard');


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

        await browser.close();
        return scrapedData;

    } catch(e){
        console.log("Error at source 1: ", e);
    }
}




