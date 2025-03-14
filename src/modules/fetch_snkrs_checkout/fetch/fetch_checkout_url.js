import path, { resolve } from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import sendWebhook from '../utilities/send_webhook.js';

dotenv.config({ path: resolve('../../../../.env') });

/**
 * @description - This function fetches the checkout URL for a product SKU from the Nike API.
 * @param {*} product_sku - The product SKU to fetch the checkout URL for.
 * @returns - Sends a webhook to Discord with the checkout URL.
 */
export default async function fetchCheckoutUrl(product_sku) {
  try {
    // Fetch Nike Backend Data
    const url = process.env.NIKE_STOCK_API;
    const response = await axios.get(url);
    const data = response.data.objects;
    // Filter out products that are not available
    const groupedData = data.map(item => {
      const productInfo = item.productInfo && Array.isArray(item.productInfo) ? item.productInfo : [];
      const links = item.links ? item.links : {};
      return { productInfo, links };
    });

    // Collecting product photo
    const dataNode = data.flatMap(item => item.publishedContent?.nodes || []);
    let productPhoto = '';
    for (const node of dataNode) {
      const altText = node.properties?.altText || '';
      if (altText.includes(product_sku)) {
        productPhoto = node.properties?.portraitURL || 'No URL found'; 
        break;
      }
    }

    // Filter out products that are not available
    let filteredProducts = [];
    try {
      filteredProducts = groupedData.flatMap(group =>
        group.productInfo.filter(product =>
          product.availability?.available === true &&
          product.merchProduct?.status === 'ACTIVE' &&
          product.merchProduct?.styleColor === product_sku
        ).map(product => ({ ...product, links: group.links }))
      );
    } catch (error) {
      console.error("Error filtering products:", error);
    }

    // Exit early if no products found 
    if (filteredProducts.length === 0) {
      console.log("Product is not avaialble yet!, try again nearby release time within 24 hours timeframe of release.");
      return;
    }

    // Get the threadId, productTitle, releaseMethod, and productId
    const threadId = filteredProducts.map(product => {
      const ref = product.links.self.ref;
      const match = ref.match(/\/threads\/v2\/([^?]+)/);
      return match ? match[1] : null;
    }).filter(Boolean); // Filter out any null values

    const productTitle = filteredProducts.map(product => product.merchProduct.labelName);
    const releaseMethod = filteredProducts.map(product => product.merchProduct.channels);
    const productId = filteredProducts.map(product => product.merchProduct.id);

    const SNKRS_URL = process.env.SNKRS_CHECKOUT_URL;
    const checkoutUrl = SNKRS_URL
      .replace('{productId}', productId)
      .replace('{threadId}', threadId);

    const checkoutLinkWithSize = {};
    for (const product of filteredProducts) {
      for (const sku of product.skus) {
        for (const spec of sku.countrySpecifications) {
          const sizeMatch = spec.localizedSize.match(/M (\d+(\.\d+)?)/);
          if (sizeMatch) {
            const size = sizeMatch[1];
            checkoutLinkWithSize[size] = checkoutUrl.replace('{size}', size);
            await sendWebhook(checkoutLinkWithSize[size], productTitle, size);
          }
        }
      }
    }

  } catch (e) {
    console.log("Error at snkrs checkout\n Contact Devs team \n", e);
  }
}