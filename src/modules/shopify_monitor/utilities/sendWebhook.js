import request from 'request';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve('../../../../.env') });



export default async function sendWebhook(productDetails){
    const shopify_webhook = process.env.SHOPIFY_DISCORD_WEBHOOK;
    
    try{
        const embed = {
            embeds : [{
                authors:{
                    name : `New Products @ ${productDetails.site}`,
                    url: productDetails.site
                },

                color : 5763719,

                title : productDetails.product.title,

                url : `${productDetails.site}/products/${productDetails.product.handlel}`,

                thumbnail: {
                    "url" : productDetails.product.images[0] ? productDetails.product.images[0].src : 'https://imgur.com/NO25iZV'
                },

                footer:{
                    icon_url : "https://www.citypng.com/public/uploads/preview/shopify-bag-icon-symbol-logo-701751695132537nenecmhs0u.png",
                    text : "pwered by Casual Soutions"
                },

                type: "rich",

                fields: productDetails.restockVaraiants.map((variant) => {
                    return{
                        name: (variant.available) ? `${variant.title}: ${(variant.inventory_quantity) ? variant.inventory_quantity : 'In'} Stock` : `${variant.title}: OOS`,
                        value: (variant.available) ? `[Checkout URL](${productDetails.site}/cart/${variant.id}:1)` : `${variant.id}`,
                        inline: true
                    }
                }),

                timestamp: new Date().toISOString()
            }]
        }

        request.post({
            url: shopify_webhook,
            followAllRedirects: true,
            simple: false,
            resolveWithFullResponse: true,
            headers:{
                'content-type': 'application/json',
            },
            body: JSON.stringify(embed)
        })

        // Log the remaining requests and the rate limit reset time
        const remainingRequests = response.headers['x-ratelimit-remaining'];
        const resetTime = response.headers['x-ratelimit-reset'];
        console.log(`Rate limit resets at: ${new Date(resetTime * 1000)}`);
    
        // If the remaining requests are 0, we are being rate limited by Discord
        if (remainingRequests === '0') {
            const retryAfter = response.headers['retry-after'];
            console.log(`Rate limited! Retrying after ${retryAfter} milliseconds.`);
            await delay(retryAfter); // Wait for the time specified in the `Retry-After` header
        }

    } catch (e){

        // If the error is a 429 (rate limit exceeded) error
        if (error.response && error.response.status === 429) {
            const retryAfter = error.response.headers['retry-after'];
            console.log(`Rate limited! Retry after ${retryAfter} milliseconds.`);
            await delay(retryAfter); // Wait for the specified time before retrying
            await sendWebhook(productDetails) // Retry the webhook after waiting
        } else {
            // Log the error if it is not a rate limit error
            console.error("SHOPIFY WEBHOOK ERROR, contact Devs ", e);
            if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            }
        }

    }
}