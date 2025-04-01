import axios from 'axios';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import sleep from './sleep.js'; // Import sleep

dotenv.config({ path: resolve('../../../../.env') });

export default async function sendWebhook(color, title, productDetails) {
    const shopifyWebhook = process.env.SHOPIFY_DISCORD_WEBHOOK;
    console.log("SHOPIFY WEBHOOK AT ", shopifyWebhook);

    try {
        const embed = {
            embeds: [{
                author: { // Fixed 'authors' to 'author'
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
                    icon_url: "https://www.citypng.com/public/uploads/preview/shopify-bag-icon-symbol-logo-701751695132537nenecmhs0u.png",
                    text: "Powered by Casual Solutions" // Fixed typo
                },
                type: "rich",
                fields: productDetails.restockedVariants.map((variant) => ({
                    name: variant.available 
                        ? `${variant.title}: ${variant.inventory_quantity || 'In'} Stock` 
                        : `${variant.title}: OOS`,
                    value: variant.available 
                        ? `[Checkout URL](${productDetails.site}/cart/${variant.id}:1)` 
                        : `${variant.id}`,
                    inline: true
                })),
                timestamp: new Date().toISOString()
            }]
        };

        const response = await axios.post(shopifyWebhook, embed, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Log rate limit info
        const remainingRequests = response.headers['x-ratelimit-remaining'];
        const resetTime = response.headers['x-ratelimit-reset'];
        console.log(`Rate limit remaining: ${remainingRequests}, resets at: ${new Date(resetTime * 1000)}`);

        if (remainingRequests === '0') {
            const retryAfter = response.headers['retry-after'] * 1000; // Convert to ms
            console.log(`Rate limited! Retrying after ${retryAfter} ms`);
            await sleep(retryAfter);
            await sendWebhook(color, title, productDetails); // Retry
        }
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