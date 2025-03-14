import { resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: resolve('../../.env') });
import read_line from '../modules/module_util/read_line.js';
import fetchCheckoutUrl from '../modules/fetch_snkrs_checkout/fetch/fetch_checkout_url.js';


export default async function push_checkout_url(){

    const SKU = await read_line("Enter the release SKU: ");
    console.log("\t\tReceived ->", SKU);
    console.log("\t\tFetching Checkout Url");

    await fetchCheckoutUrl(SKU);
}
