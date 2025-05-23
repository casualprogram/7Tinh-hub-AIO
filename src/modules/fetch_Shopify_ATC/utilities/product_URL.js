import getBaseUrl from "./getBaseUrl.js";
import getProductHandle from "./get_product_handle.js";
import isProductUrl from "./is_product_url.js";

/**
 * @description productURL - Gathering and creating product URL.
 * @param {*} url - The URL of the product page.
 * @returns
 */
export default async function productURL(url) {
  const atcEndPoint = process.env.ATC_PRODUCT_END_POINT;
  const atcMainPageEndPoint = process.env.ATC_MAIN_PAGE_END_POINT;
  const baseURLL = await getBaseUrl(url);
  console.log("Base URL: ", baseURLL);

  const mainPage = isProductUrl(url);

  let productJsonUrl;
  if (mainPage) {
    productJsonUrl = `${baseURLL}/${atcMainPageEndPoint}`;
  } else {
    const handle = await getProductHandle(product_URL);
    console.log("Product Handle: ", handle);
    productJsonUrl = `${baseURLL}/products/${handle}${atcEndPoint}`;
  }
  console.log("Product JSON URL: ", productJsonUrl);

  return productJsonUrl;
}
