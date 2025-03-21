import getFirstData from "../modules/fetch_news/fetch/fetch_source_1.js";
import getThirdData from "../modules/fetch_news/fetch/fetch_source3.js";

import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import getSecondData from '../modules/fetch_news/fetch/fetch_source_2.js';
dotenv.config({ path: resolve('../../.env') });
const filePath1 = path.resolve('../data/source1/stories.json');
const filePath2 = path.resolve('../data/source1/stories2.json');


/**
 * @description - This function is the interface, connected to the CLI.
 *               It is responsible for calling the functions that fetch the data from the source and format it.
 */
export default async function push_news(){
    // Fetch the data from the source
    await getFirstData();
    console.log("\n----------\n ---> SUCCESSFULLY FETCH FIRST DATA\n----------");


    await getSecondData();
    console.log("\n----------\n ---> SUCCESSFULLY FETCH SECOND DATA\n----------");


    await getThirdData();
    console.log("\n----------\n ---> SUCCESSFULLY FETCH THIRD DATA\n----------");

    
    console.log("\n----------\n --> SEND TO THE COMMUNITY...\n----------");
    
}