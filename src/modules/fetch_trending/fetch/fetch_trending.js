import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import sendWebhook from '../utilities/send_webhook.js';
dotenv.config({ path: path.resolve('../../../../.env') });

/**
 * @description - This function fetches weekly trending data from the API and sends a webhook to Discord.
 * @returns  - Sends a webhook to Discord with the weekly trending data.
 */
export default async function fetchWeeklyTrending(){

    const url = process.env.WEEKLY_TRENDING;

    // Fetch the data from the endpoint
    const response = await axios.get(url,{
        headers:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    })
    // Parse the JSON data
    const JsonData = response.data.result.data;
    // Map the data to a new array
    const array = JsonData.data.map(item => {
        return {
            productTitle: item.product_name,
            productImageUrl: item.product_thumbnail,
            productReleaseDate: item.releaseDate,
            productRank : item.current_rank,
            prductLastWeekRank : item.previous_rank,
            productPrice: item.price,
        }
    });

    // iterate over the array of data
    for (let i = 0; i < array.length; i++) {
        let rankUpdate = array[i].productRank - array[i].prductLastWeekRank;
        if (rankUpdate < 0){
            rankUpdate = `Down ${Math.abs(rankUpdate)} Rank :arrow_down: :red_circle: `;
        } else{
            rankUpdate = `Up ${Math.abs(rankUpdate)} Rank :arrow_up: :green_circle: `;
        }
        // Send the webhook
        await sendWebhook(array[i].productTitle, array[i].productImageUrl, array[i].productReleaseDate, array[i].productRank, rankUpdate);
    }
}