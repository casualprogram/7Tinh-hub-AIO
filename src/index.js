import dotenv from 'dotenv';
dotenv.config({ path: resolve('../.env') });

import { resolve } from 'path';

const DISCORD_WEBHOOK_KEY = process.env.DISCORD_WEBHOOK;

import formattedFirstData from './modules/helper/formatting_data.js';
import { getFirstData } from './modules/fetch/source1.js';
import delay from './modules/helper/delay.js';
import { sendWebhook } from './modules/discord_msg/news_notify.js';


async function main() {
    
}

main();