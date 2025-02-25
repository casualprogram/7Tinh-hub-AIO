import fs from 'fs/promises';
import { resolve } from 'path';
import delay from './delay.js';
import sendWebhook from '../discord_msg/news_notify.js';
import isWithin23Hours from './old_news_filter.js';


export default async function formattedFirstData(filePath) {
    try{
        
        const data = await fs.readFile(filePath, {encoding: "utf-8"});

        const stories = JSON.parse(data);

        for (const story of stories) {
            if (isWithin23Hours(story.timestamp)) {
                await delay(500);
                const headline = story.headline;
                const imageURL = story.pictureUrl;
                const postUrl = story.postUrl;

                await sendWebhook(headline, imageURL, postUrl);
        }
    }

    }    
    catch(error){
        console.error("Error scraping data", error);
    }
}


