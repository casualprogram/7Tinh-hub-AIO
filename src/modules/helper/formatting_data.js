import fs from 'fs/promises';
import { resolve } from 'path';
import delay from './delay.js';
import sendWebhook from '../discord_msg/news_notify.js';

const filepath = resolve('../../data/source1/stories.json');

export default async function formattedFirstData(filePath) {
    try{
        
        const data = await fs.readFile(filePath, {encoding: "utf-8"});
        console.log("Data has been read successfully");

        const stories = JSON.parse(data);

        for (const story of stories) {
            await delay(500);
            const headline = story.headline;
            const imageURL = story.pictureUrl;
            const postUrl = story.postUrl;
            console.log("headline: ", headline);
            console.log("imageURL: ", imageURL);
            console.log("postUrl: ", postUrl);
            console.log("-------------------------------------------------/n");
            await sendWebhook(headline, imageURL, postUrl);
        }

        console.log("Webhook sent successfully");
    }    
    catch(error){
        console.error("Error scraping data", error);
    }
}



