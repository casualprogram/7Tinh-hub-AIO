import path, { resolve } from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import isWithin23HoursSource2 from '../helper/time_filter_src_2.js';
dotenv.config({ path: resolve('../../../../.env') });


/**
 * @description - This function is responsible for fetching the data from the source.
 */
export default async function getSecondData(){
    try{
        // Fetch the data from the source 
        const SOURCE_URL_2 = process.env.SOURCE_2;
        const filePath = path.resolve('../../src/data/source1/stories2.json');

        
        // Fetch the data from the source
        const response = await axios.get(SOURCE_URL_2,{
            headers:{
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        // Parse the data
        const jsonData = response.data.posts._embedded.items;
        
        // Filter the data
        const filteredData = jsonData.map(item => ({
            title: item.title || "N/A",
            info: item.excerpt || "N/A",
            postUrl: item._links.self.href || "N/A",
            imageUrl: item._links.thumbnail.href || "N/A",
            timestamp : item.date
        }));

        // Filter the data so it only contains the recent data
        // TODO : notice how it only fetch the data within 23 hours with no filteredData, it might not necessary to filter again.
        const recentData =  filteredData.filter(item => {
            return isWithin23HoursSource2(item.timestamp);
        }).map(item => ({
            title: item.title,
            info: item.title,
            postUrl: item.postUrl,
            imageUrl: item.imageUrl,
            timestamp: item.timestamp
        }));
        
        // Write the data to the file system
        await fs.writeFile(filePath, JSON.stringify(recentData, null, 2)), {encoding: "utf-8"};


    } catch(e){
        console.log("Error at source 2 scrapping\n Contact Devs team \n", e);
    }
}

