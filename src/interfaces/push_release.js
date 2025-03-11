import { resolve } from 'path';
import dotenv from 'dotenv';
import read_line from '../modules/module_util/read_line.js';
import fetchRaffle from '../modules/fetch_raffle/fetch/fetch_raffle.js';
dotenv.config({ path: resolve('../../.env') });


/**
 * @description - This function is the interface, connected to the CLI.
 *               It is responsible for calling the functions that fetch the raffle release and send to discord.
 */
export default async function push_release_info(){

    const SKU = await read_line("Enter the release SKU: ");
    console.log("\t\tReceived ->", SKU);
    console.log("\t\tFetching Raffle");

    await fetchRaffle(SKU);
    
}