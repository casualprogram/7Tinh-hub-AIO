export default async function getProductHandle(product_URL) {
  try {
    const parsedUrl = new URL(product_URL);
    const pathParts = parsedUrl.pathname.split("/products/");

    if (pathParts.length < 2) {
      throw new Error("Invalid product URL provided");
    }

    // Get the product handler only
    return pathParts[1].split("?")[0];
  } catch (error) {
    throw new Error(`Failed to extract handle: ${error.message}`);
  }
}
