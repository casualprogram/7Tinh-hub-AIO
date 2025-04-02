import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import axios from 'axios';
import sendWebhook from '../utilities/sendWebhook.js';
import Monitor from './class/fetch_shopify_monitor.js';
import readline from 'node:readline';
import logWithTimestamp from '../../module_util/log_with_timestamp.js'


const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default function oneSite(initSite){
    const proxies = [];
    const monitors = [];

    try{

        // Load proxies
        fs.readFileSync(path.resolve(__dirname, '../config/proxies.txt'), 'utf-8')
        .split(/\r?\n/)
        .forEach((line) => proxies.push(line));

        function startMonitor(site){
            const currentMonitor = new Monitor({
                site,
                proxies
            });
            
            console.log("\t\t_________________________________");
        
            currentMonitor.on('newProduct', (productDetails) => {
                sendWebhook(5763719, 'New Product', productDetails);
                logWithTimestamp('\n\t\tNew Product @ ' + productDetails.site + ': ' + productDetails.product.title);
            });
    
            currentMonitor.on('restockedProduct', (restockDetails) => {
                    sendWebhook( 242172, 'Product Restock', restockDetails);
                logWithTimestamp('\n\t\tRestock @ ' + restockDetails.site + ': ' + restockDetails.product.title);
            });
            
            monitors.push(currentMonitor);
            return currentMonitor;
        }



        // Set up readline for terminal input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.setPrompt("\n\t\tEnter a new site URL to monitor (or 'exit' to quit): ");

        // Handle initial site
        if (initSite) {
            try {
                new URL(initSite); // Validate initial site
                startMonitor(initSite);
                rl.prompt();
            } catch (error) {
                console.error('\t\t-> Invalid initial site URL:', initSite);
                rl.prompt(); // Prompt for new input instead of exiting
            }
        } else {
            rl.prompt(); // No initial site, start prompting
        }

        rl.on('line', (input) => {
            const trimmedInput = input.trim();

            if (trimmedInput.toLowerCase() === 'exit') {
                console.log('Stopping Shopify Monitor...');
                monitors.forEach(monitor => monitor.destroy());
                rl.close();
            } else if (monitors.some(monitor => monitor.site === trimmedInput)) {
                console.log(`Website already included\n\n\t\tMONITOR STATUS\n\t\tCurrent sites monitored: ${monitors.length}`);
                rl.prompt();
            } else if (trimmedInput) {
                try {
                    const normalizedInput = new URL(trimmedInput).origin; // Normalize input
                    if (monitors.some(monitor => monitor.site === normalizedInput)) {
                        console.log(`\t\tWebsite already included\n\n\t\tMONITOR STATUS\n\t\tCurrent sites monitored: ${monitors.length}`);
                        rl.prompt();
                    } else {
                        startMonitor(trimmedInput); // Pass original input to preserve format
                        console.log(`\t\tAdded monitor for ${trimmedInput}.\n\n\t\tMONITOR STATUS\n\t\tCurrent sites monitored: ${monitors.length}`);
                        rl.prompt();
                    }
                } catch (e) {
                    console.error('\t\t',trimmedInput, 'is an invalid Shopify URL. Please try again !');
                    rl.prompt();
                }
            } else {
                rl.prompt(); // Empty input
            }
        });

        rl.on('close', () => {
            console.log('Shopify Monitor stopped.');
            process.exit(0);
        });

    } catch(error){
        console.log('Error in One Site Shopify Monitor', error.message);
        throw error;
    }
    

}
