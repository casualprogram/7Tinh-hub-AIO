import axios from 'axios';
import dotenv from 'dotenv';
import sleep from './sleep.js'; 
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url)); // Get current directory

// Resolve the path to your .env file
const envPath = resolve(__dirname, '../../../../.env'); 

dotenv.config({ path: envPath });

export default async function sendWebhook(color, title, productDetails) {
    const discordWebHook = process.env.SHOPIFY_DISCORD_WEBHOOK;

    try {
        const embed = {
            embeds: [{
                author: { 
                    name: `${title} @ ${productDetails.site}`,
                    url: productDetails.site
                },
                color: color,
                title: productDetails.product.title,
                url: `${productDetails.site}/products/${productDetails.product.handle}`, // Fixed 'handlel'
                thumbnail: {
                    url: productDetails.product.images[0]?.src || 'https://imgur.com/NO25iZV'
                },
                footer: {
                    icon_url: "https://pbs.twimg.com/profile_images/1398475007584444418/GRPcs63v_400x400.jpg",
                    text: "Powered by Casual Solutions" 
                },
                type: "rich",
                fields: productDetails.restockedVariants.map((variant) => ({
                    name: variant.available 
                        ? `${variant.title}: ${variant.inventory_quantity || 'In'} Stock` 
                        : `${variant.title}: OOS`,
                    value: variant.available 
                        ? `[ATC](${productDetails.site}/cart/${variant.id}:1)` 
                        : ``,
                    inline: true
                })),
                timestamp: new Date().toISOString()
            }]
        };

        const response = await axios.post(discordWebHook, embed, {
            headers: { 'Content-Type': 'application/json' }
        });


    } catch (error) {
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] * 1000; // Convert to ms
            console.log(`Rate limited! Retrying after ${retryAfter} ms`);
            await sleep(retryAfter);
            await sendWebhook(color, title, productDetails); // Retry
        } else {
            console.error("SHOPIFY WEBHOOK ERROR, contact Devs: ", error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
    }
}