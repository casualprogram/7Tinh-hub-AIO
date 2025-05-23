/**
 * @description isProductUrl - Checks if the given URL is a product URL.
 * @param {*} url - url to check
 * @returns
 */
export default async function isProductUrl(url) {
  return url.includes("/products/");
}
