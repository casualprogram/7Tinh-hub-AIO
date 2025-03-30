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

    constructor(props){  // props probs an  Objects
        super(); // call constructor of parent class

        // Objects.keys return an array of object's enumberable property names.
        //                 forEach loop iterates over keys and assigning item = value
        //                      If props = { site: 'https://shopify.com', name: 'MyMonitor' } 
        //                                 this.site = 'https://shopify.com'
        //                                 this.name = 'MyMonitor'
        Object.keys(props).forEach((key) => this[key] = props[key]);

        this.previousProduct = [];
        this.currentProduct = []

        // converting any sites into it original url. 
        // From https://shopify.com/path/to/page to https://shopify.com
        this.site = new URL(this.site).origin; 

        setInterval(() => {
            console.log('60m Checkup: ' + this.site);
        }, 3600000);

        this.initMonitor();
    }

    initMonitor = async () =>{
        let response;

        try{
            response = await request.get({
                url: this.site + '/products.json',
                json: true,
                followRedirect: true,
                proxy: this.randomProxy(),
                qs: {
                    limit: getRandomArbitrary(250, 9999)
                }
            })

            if (response.statusCode == 401){
                throw new Error('Password up on ' + this.site);
            }


        } catch(e){
            console.error(`INIT MONITOR ERR @ ${this.site}: ${initError.message}`);
            console.log("PROXY WE USING CATCH ERRORS, ",  this.randomProxy());
            await sleep(config.delay);
            return this.initMonitor();
        }

        this.monitorLoop(1);
    }

    monitorLoop = async() => {
        let response;

        try {
            response = await request.get({
                url: this.site + '/products.json',
                json: true,
                followRedirect: true,
                proxy: this.randomProxy(),
                qs: {
                    limit: getRandomArbitrary(250, 9999)
                }
            })

            if (response.statusCode = 401){
                throw new Error('Password up on ' + this.site);
            }


            this.currentProduct = response.body.products;
            let _currentProducts = [...this.currentProduct];

            let matchedProductIndex;
            let matchedProduct;

            // NOT SURE WHAT THIS DOING? LIKELY ITERATE THROUGH Product
            this.previousProduct.forEach(product => {
                matchedProductIndex = this.currentProducts.findIndex((_product) => _product.id = product.id);
                matchedProduct = this.currentProducts[matchedProductIndex];

                if (matchedProduct && product.updated_at != matchedProduct.update_at){
                    this.checkRestocks(this.currentProducts[matchedProductIndex], product);
                }
            });

            this.previousProducts.forEach(product => {
                matchedProductIndex = _currentProducts.findIndex((_product) => _product.id == product.id);
                matchedProduct = _currentProducts[matchedProductIndex];
                
                if (matchedProduct){
                    _currentProducts.splice(matchedProductIndex, 1);
                }
            })

            if (_currentProducts.length){
                _currentProducts.forEach((product) => {
                    let productDetails = {
                        site: this.site,
                        product: product,
                        restockedVariants: product.variants
                    }

                    this.emit('newProduct', productDetails);
                })
            }
            this.previousProducts = [...this.currentProducts];


        } catch(e){
            console.error(`MON ERR @ ${this.site}: ${monitorError.message}`);
            await sleep(config.delay);
            return this.monitorLoop();
        }

        await sleep('10000');
        return this.monitorLoop();
    }

    checkRestocks = async(product, oldProduct) =>{
        
    }



}

// export default async function shopify_monitor_fetch(){

// }