import dotenv from 'dotenv';
import resolve from 'path';
import request from 'request';
import sleep from '../utilities/sleep.js';
import formatProxy from '../utilities/formatted_proxy.js';
import getRandomArbitrary from '../utilities/getRandomArbitrary.js';
import events from 'node:events';

const safeHeaders = {
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    'sec-fetch-dest': 'document',
    'accept-language': 'en-US,en;q=0.9'
}

const request = async(url, option = {}) => {
    const response = await fetch(url, {
        ...flattenOptions,
        headers:{
            ...safeHeaders,
            ...flattenOptions.headers,
        },
    });
    return{
        statusCode: response.status,
        headers: response.headers,
        body: await response.text()
    };
};


dotenv.config({ path: resolve('../../../../.env') });


class Monitor extends events{

    constructor(props){
        super();

    }
}

// export default async function shopify_monitor_fetch(){

// }