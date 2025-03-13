import path, { resolve } from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';


dotenv.config({ path: resolve('../../../../.env') });

export default async function fetchCheckoutUrl(product_sku) {

    try{

           // Fetch API data
        const url = process.env.NIKE_STOCK_API;
        const response = await axios.get(url);
        const data = response.data.objects;

        // Collecting threadId
        const dataNode = data.flatMap(item => item.publishedContent?.nodes.isArray || []);


        console.log("Checkout info saved to file");





    } catch(e){
        console.log("Error at snkrs checkout\n Contact Devs team \n", e);
    }
}

fetchCheckoutUrl("HF4340-800");