import getFirstData from "../modules/fetch/fetch_source_1.js";
import formattedData from "../modules/helper/formatting_data.js";
import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import getSecondData from '../modules/fetch/fetch_source_2.js';


dotenv.config({ path: resolve('../../.env') });

const SOURCE_URL_1 = process.env.SOURCE_1;

const filePath1 = path.resolve('../data/source1/stories.json');
const filePath2 = path.resolve('../data/source1/stories2.json');


/**
 * @description - This function is the interface, connected to the CLI.
 *               It is responsible for calling the functions that fetch the data from the source and format it.
 */
export default async function push_news(){
    // Fetch the data from the source
    await getFirstData(filePath1, SOURCE_URL_1);
    console.log("\n----------\n ---> SUCCESSFULLY FETCH FIRST DATA\n----------");

    console.log("\n----------\n ---> SUCCESSFULLY FETCH SECOND DATA\n----------");
    await getSecondData();


    // Format the data and send it to the community
    await formattedData(filePath1);
    await formattedData(filePath2)

    console.log("\n----------\n --> SEND TO THE COMMUNITY...\n----------");
    
}