import dotenv from 'dotenv';
dotenv.config({ path: resolve('../.env') });

import { resolve } from 'path';

async function main() {
    //TODO consider using a logger to log the start of the application
    console.log('Application started');
}

main();