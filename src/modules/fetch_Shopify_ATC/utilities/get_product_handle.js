/**
 * @description This function extracts the product handle from a given Shopify product URL.
 * @param {*} product_URL - The URL of the product page.
 * @returns
 */
export default async function getProductHandle(product_URL) {
  try {
    const parsedUrl = new URL(product_URL);

    // Split the pathname to isolate the product handle
    const pathParts = parsedUrl.pathname.split("/products/");

    // Check if the URL contains the product handle
    if (pathParts.length < 2) {
      throw new Error("Invalid product URL provided");
    }

    // Get the product handler only
    return pathParts[1].split("?")[0];
  } catch (error) {
    throw new Error(`Failed to extract handle: ${error.message}`);
  }
}
