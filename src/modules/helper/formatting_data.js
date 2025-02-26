import fs from 'fs/promises';
import delay from './delay.js';
import sendWebhook from '../discord_msg/news_notify.js';
import isWithin23HoursSource1 from './time_filter_src_1.js';

import path, { basename } from 'path';


/**
 * @description  - This function is responsible for formatting the data and sending it to the community.
 * @param {*} filePath  - The path to the file where the data is stored
 */
export default async function formattedData(filePath) {
    try{
        const fileName = basename(filePath);
        // Read the data from the file system
        const data = await fs.readFile(filePath, {encoding: "utf-8"});
        // Parse the data
        const stories = JSON.parse(data);


        // check for file name
        if (fileName === "stories.json"){
            // Loop through the stories
            for (const story of stories) {
                if (isWithin23HoursSource1(story.timestamp)) {
                    await delay(500);
                    const headline = story.headline;
                    const imageURL = story.pictureUrl;
                    const postUrl = story.postUrl;

                    await sendWebhook(headline, imageURL, postUrl);
                }
            }

        // check for file name
        } else if (fileName === "stories2.json"){
            // Loop through the stories
            for (const story of stories) {
                await delay(500);
                const headline = story.title;
                const imageURL = story.imageUrl;
                const postUrl = story.postUrl;

                await sendWebhook(headline, imageURL, postUrl);
                
            }
        }
    }
    catch(error){
        console.error("Error scraping data", error);
    }
}
