import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import delay from '../../module_util/delay.js';
import autoScroll from '../../module_util/auto_scroll.js';
import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import { load as cheerio } from 'cheerio'; // Named import
import sendWebhook from '../utilities/send_webhook.js';
dotenv.config({ path: resolve('../../../../.env') });



export default async function fetchRaffle(SKU){
    
    const url = process.env.RAFFLE_URL + SKU;
    console.log("Fetched URL", url);

    try{
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized"],
            ignoreHTTPSErrors: true
        });
        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
          );
          
          await page.goto(url, {
            waitUntil: 'networkidle2', // Wait for network to settle
            timeout: 60000,
          });

        const html = await page.content();


        const pathFlieHTML = path.resolve('../../../data/raffle/raffle.html');
        await fs.writeFile(pathFlieHTML, html, {encoding: "utf-8"});

        const $ = cheerio(html);

        const titleElement = $('div.slide-title h4');
        const productTitle = titleElement.text().trim() || 'N/A';

        // Extract Image
        const image = $('div.slider-img-cnt-blk img').attr('src') || 'N/A';

        const retailers = [];

        $('table tbody tr').each((index, element) => {
          const retailerName = $(element).find('td.retailer-col a span').text().trim() || 'N/A';
          const retailerUrl = $(element).find('td.retailer-col a').attr('href') || 'N/A';
          const timeOfRelease = $(element).find('td.time-col span').text().trim() || 'N/A';
          const releaseType = $(element).find('td.release-type span').text().trim() || 'N/A';
    
            if (retailerUrl !== "N/A"){
                retailers.push({
                    name: "["+retailerName+"]"+"("+retailerUrl+")",
                    timeOfRelease,
                    releaseType,
                });
            }
        });

        const raffleData = {
            productTitle,
            image,
            retailers,
          };

        const pathFile = path.resolve('../../../data/raffle/raffleJson.json');
        await fs.writeFile(pathFile, JSON.stringify(raffleData, null, 2), {encoding: "utf-8"});
        console.log("retaile", retailers);  
        console.log("File written successfully");

        await browser.close();


        try{
            await sendWebhook(productTitle, image, retailers);
        } catch (error) {
            console.log("Error sending the webhook", error);
        }

    } catch (error) {
        console.log("Error fetching the raffle", error);
    }

    return;
}


fetchRaffle("hv4794-011");