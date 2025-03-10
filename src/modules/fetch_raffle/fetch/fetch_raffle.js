import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import delay from '../../module_util/delay.js';
import autoScroll from '../../module_util/auto_scroll.js';
import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
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
        console.log('Fully rendered HTML fetched from Puppeteer');

        const pathFile = path.resolve('../../../data/raffle/raffle.html');
        await fs.writeFile(pathFile, JSON.stringify(html, null, 2), {encoding: "utf-8"});
        console.log("File written successfully");


    } catch (error) {
        console.log("Error fetching the raffle", error);
    }

}


fetchRaffle("311090-100");