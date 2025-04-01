import axios from 'axios';
import { EventEmitter } from 'node:events';
import { URL } from 'node:url';
import sleep from '../utilities/sleep.js';
import formatProxy from '../utilities/formatted_proxy.js';
import getRandomArbitrary from '../utilities/getRandomArbitrary.js';


const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36';
const safeHeaders = {
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'upgrade-insecure-requests': '1',
    'user-agent': userAgent,
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    'sec-fetch-dest': 'document',
    'accept-language': 'en-US,en;q=0.9'
};

// Custom console timestamp (replacing console-stamp)
const originalConsoleLog = console.log;
console.log = (...args) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
    originalConsoleLog(`[${timestamp}]`, ...args);
};


export default class Monitor extends EventEmitter{
    constructor(props){
        super();

        Object.keys(props).forEach((key) => (this[key] = props[key]));

        this.previousProducts = [];
        this.currentProducts = [];

        this.site = new URL(this.site).origin;

        this.checkupInterval = setInterval(() => {
            console.log('60m Checkup: ' + this.site);
        }, 3600000);

        this.initMonitor();
    }

    randomProxy = () => {
        return formatProxy(this.proxies[Math.floor(Math.random() * this.proxies.length)]);
    };

    initMonitor = async () => {
        try {
            const response = await axios.get(`${this.site}`, {
                headers: safeHeaders,
                params: { limit: getRandomArbitrary(250, 9999) },
                proxy: this.randomProxy(),
                maxRedirects: 5, // Follow redirects (matches followRedirect: true)
                responseType: 'json' // Parse JSON automatically
            });

            if (response.status === 401) {
                throw new Error('Password up on ' + this.site);
            }

            this.previousProducts = response.data.products;
        } catch (initError) {
            console.error(`INIT ERR @ ${this.site}: ${initError.message}`);
            console.log("PROXY WE USING CATCH ERRORS, ", this.randomProxy());
            await sleep(1000);
            return this.initMonitor();
        }

        this.monitorLoop(1);
    };

    monitorLoop = async () => {
        try {
            const response = await axios.get(`${this.site}`, {
                headers: safeHeaders,
                params: { limit: getRandomArbitrary(250, 9999) },
                proxy: this.randomProxy(),
                maxRedirects: 5,
                responseType: 'json'
            });

            if (response.status === 401) {
                throw new Error('Password up on ' + this.site);
            }

            this.currentProducts = response.data.products;
            let _currentProducts = [...this.currentProducts];

            let matchedProductIndex, matchedProduct;

            this.previousProducts.forEach((product) => {
                matchedProductIndex = this.currentProducts.findIndex((_product) => _product.id === product.id);
                matchedProduct = this.currentProducts[matchedProductIndex];
                if (matchedProduct && product.updated_at !== matchedProduct.updated_at) {
                    this.checkRestocks(this.currentProducts[matchedProductIndex], product);
                }
            });

            this.previousProducts.forEach((product) => {
                matchedProductIndex = _currentProducts.findIndex((_product) => _product.id === product.id);
                matchedProduct = _currentProducts[matchedProductIndex];
                if (matchedProduct) _currentProducts.splice(matchedProductIndex, 1);
            });

            if (_currentProducts.length) {
                _currentProducts.forEach((product) => {
                    const productDetails = {
                        site: this.site,
                        product,
                        restockedVariants: product.variants
                    };
                    this.emit('newProduct', productDetails);
                });
            }

            this.previousProducts = [...this.currentProducts];
        } catch (monitorError) {
            console.error(`MON ERR @ ${this.site}: ${monitorError.message}`);
            await sleep(1000);
            return this.monitorLoop();
        }

        await sleep(1000);
        return this.monitorLoop();
    };


    checkRestocks = async (product, oldProduct) => {
        const restockDetails = {
            site: this.site,
            product,
            restockedVariants: []
        };

        product.variants.forEach((variant) => {
            if (variant.available && !oldProduct.variants.find((_variant) => _variant.id === variant.id).available) {
                restockDetails.restockedVariants.push(variant);
            }
        });

        if (restockDetails.restockedVariants.length) {
            this.emit('restockedProduct', restockDetails);
        }
    };

    destroy = () => {
        clearInterval(this.checkupInterval);
    };


}

