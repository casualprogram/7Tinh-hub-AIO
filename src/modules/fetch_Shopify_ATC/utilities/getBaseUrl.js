/**
 * @description getBaseUrl - Extracts the base URL from the given product URL.
 * @description This function takes a product URL and returns the base URL (protocol + hostname).
 * @param {*} product_URL - The URL of the product page.
 * @returns
 */
export default async function getBaseUrl(product_URL) {
  try {
    // break down the URL to different parts: protocol, hostname, pathname
    const parsedUrl = new URL(product_URL);
    //      https: + // + website.com
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  } catch (error) {
    console.error("Invalid product URL provided ");
    return null;
  }
}
