import path, { resolve } from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import isWithin23HoursSource2 from '../helper/time_filter_src_2.js';
import { title } from 'process';
import sendWebhook from '../discord_msg/news_notify.js';
dotenv.config({ path: resolve('../../../../.env') });


/**
 * @description - This function is responsible for fetching the data from the source.
 */
export default async function getThirdData(){
    try{
        // Fetch the data from the source 
        const SOURCE_URL_3 = process.env.SOURCE_3;

        const filePath = path.resolve('../../../data/source1/stories3.json');

        
        // Fetch the data from the source
        const response = await axios.get(SOURCE_URL_3,{
            headers:{
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        // Parse the data
        const jsonData = response.data;

       
        const filteredData = jsonData.data
        .filter(item => !item.time.includes('day ago'))
        .map(item => ({
            title: item.title || "N/A",
            postUrl: item.post_link || "N/A",
            imageUrl: item.image|| "N/A",
        }));

        console.log("filteredData is : ", filteredData);

        try{
            for (let i = 0; i < filteredData.length; i++) {
                await sendWebhook(filteredData[i].title, filteredData[i].imageUrl, filteredData[i].postUrl);
            }
        }catch(e){
            console.log("Error at sending webhook source 3\n Contact Devs team \n", e);
        }

        // Write the data to the file system
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2)), {encoding: "utf-8"};
        
        
    } catch(e){
        console.log("Error at source 3 scrapping\n Contact Devs team \n", e);
    }
}

