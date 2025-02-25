import getFirstData from "../modules/fetch/fetch_source_1.js";
import formattedFirstData from "../modules/helper/formatting_data.js";
import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';


dotenv.config({ path: resolve('../../.env') });

const SOURCE_URL_1 = process.env.SOURCE_1;

const filePath = path.resolve('../data/source1/stories.json');

export default async function push_news(){

    await getFirstData(filePath, SOURCE_URL_1);

    console.log("\n----------\t ---> SUCCESSFULLY FETCH COMPLEX DATA\n----------");

    await formattedFirstData(filePath);

    console.log("\n----------\\t --> SEND TO THE COMMUNITY...\n----------");
    
}