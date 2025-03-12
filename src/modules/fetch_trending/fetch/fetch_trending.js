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


    const response = await axios.get(url,{
        headers:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    })

    const JsonData = response.data.result.data;

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

    
    for (let i = 0; i < array.length; i++) {
        let rankUpdate = array[i].productRank - array[i].prductLastWeekRank;
        if (rankUpdate < 0){
            rankUpdate = `:arrow_down:  ${Math.abs(rankUpdate)}`;
        } else{
            rankUpdate = `:arrow_up:  ${Math.abs(rankUpdate)}`;
        }
        
        await sendWebhook(array[i].productTitle, array[i].productImageUrl, array[i].productReleaseDate, array[i].productRank, rankUpdate);
    }
}