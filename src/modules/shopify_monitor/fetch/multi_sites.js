import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sendWebhook from '../utilities/sendWebhook.js';
import Monitor from './class/fetch_shopify_monitor.js';
import logWithTimestamp from '../../module_util/log_with_timestamp.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const proxies = [];
const sites = [];

export default async function multiShopifyMonitor(){

    try{
        // Load proxies
        fs.readFileSync(path.resolve(__dirname, '../config/proxies.txt'), 'utf-8')
        .split(/\r?\n/)
        .forEach((line) => proxies.push(line));

        // Load sites
        fs.readFileSync(path.resolve(__dirname, '../config/sites.txt'), 'utf-8')
        .split(/\r?\n/)
        .forEach((line) => sites.push(line));


        // Setup Monitors
        sites.forEach((site) => {
            const currentMonitor = new Monitor({
                site,
                proxies
            });
            console.log('Monitor Started for ' + site);
            currentMonitor.on('newProduct', (productDetails) => {
                sendWebhook(1305395, 'New Product', productDetails);
                logWithTimestamp('New Product @ ' + productDetails.site + ': ' + productDetails.product.title);
            });
            currentMonitor.on('restockedProduct', (restockDetails) => {
                sendWebhook(242172, 'Product Restock', restockDetails);
                logWithTimestamp('Restock @ ' + restockDetails.site + ': ' + restockDetails.product.title);
            });
        });
        console.log("\n\t\t Shopify Monitor currently has", sites.length , 'sites');
    } catch (error){
        console.log("Error in Multi Sites Shopify Monitor", error.message);
        throw error;
    }
}
