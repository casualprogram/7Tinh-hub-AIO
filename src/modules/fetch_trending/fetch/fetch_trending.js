import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import sendWebhook from '../utilities/send_webhook.js';
dotenv.config({ path: path.resolve('../../../../.env') });


export default async function fetchWeeklyTrending(){
    console.log("Fetching Weekly Trending");

    const filePath = path.resolve('../../../data/trend.json');

    const url = process.env.WEEKLY_TRENDING;

    console.log("URL is : ", url);

    const response = await axios.get(url,{
        headers:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    })

    const JsonData = response.data.result.data;

    // console.log("Response is : ", JsonData);


    const result = []

    const array = JsonData.data.map(item => {
        return {
            productTitle: item.product_nickname,
            productImageUrl: item.product_thumbnail,
            productReleaseDate: item.releaseDate,
            productRank : item.current_rank,
            prductLastWeekRank : item.previous_rank,
            productPrice: item.price,
        }
    });

    await fs.writeFile(filePath, JSON.stringify(array,null,2), {encoding: 'utf-8'});
    
    for (let i = 0; i < array.length; i++) {
        let rankUpdate = array[i].productRank - array[i].prductLastWeekRank;
        console.log("Rank update is : ", rankUpdate);
        await sendWebhook(array[i].productTitle, array[i].productImageUrl, array[i].productReleaseDate, array[i].productRank, array[i].prductLastWeekRank);
    }
}
