import getFirstData from "../modules/fetch/fetch_source_1.js";
import formattedFirstData from "../modules/helper/formatting_data.js";
import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';


dotenv.config({ path: resolve('../../.env') });

const SOURCE_URL_1 = process.env.SOURCE_1;

const filePath = path.resolve('../data/source1/stories.json');


/**
 * @description - This function is the interface, connected to the CLI.
 *               It is responsible for calling the functions that fetch the data from the source and format it.
 */
export default async function push_news(){
    // Fetch the data from the source
    await getFirstData(filePath, SOURCE_URL_1);
    console.log("\n----------\n ---> SUCCESSFULLY FETCH COMPLEX DATA\n----------");

    // Format the data and send it to the community
    await formattedFirstData(filePath);
    console.log("\n----------\n --> SEND TO THE COMMUNITY...\n----------");
    
}