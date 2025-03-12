import { resolve } from 'path';
import dotenv from 'dotenv';
import fetch_trending from '../modules/fetch_trending/fetch/fetch_trending.js';
dotenv.config({ path: resolve('../../.env') });


/**
 * @description - This function is the interface, connected to the CLI.
 *               It is responsible for calling the functions that fetch the weekly trending and send to discord.
 */
export default async function push_weekly_trending(){
    console.log("\t\tFetching Weekly Trending");
    await fetch_trending();
    
   
}