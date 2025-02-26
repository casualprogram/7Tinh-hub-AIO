import fs from 'fs/promises';
import delay from './delay.js';
import sendWebhook from '../discord_msg/news_notify.js';
import isWithin23Hours from './old_news_filter.js';


/**
 * @description  - This function is responsible for formatting the data and sending it to the community.
 * @param {*} filePath  - The path to the file where the data is stored.
 */
export default async function formattedFirstData(filePath) {
    try{
        // Read the data from the file system
        const data = await fs.readFile(filePath, {encoding: "utf-8"});
        // Parse the data
        const stories = JSON.parse(data);
        // Loop through the stories
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


