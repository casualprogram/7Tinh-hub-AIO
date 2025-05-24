import fastMode from "../utilities/fast_mode_product.js"; // Import your fastMode function
import normalMode from "../utilities/normal_mode_product.js";

/**
 * fetchATC - Act as an interface for the ATC fetch process.
 * @param {*} product_URL - The URL of the product to fetch
 * @returns {Promise<boolean>} - Returns true if the fetch was successful, false otherwise.
 */
export default async function fetchATC(product_URL) {
  // try fast mode first
  try {
    await fastMode(product_URL);
  } catch (error) {
    // if antibot is up, we switch to normal mode
    if (error.response && error.response.status === 403) {
      console.log(
        "\t 403 CloudFare Anti-bot is up -> Fast Mode failed, trying Normal Mode..."
      );
      try {
        // run normal mode as backup Plan B
        await normalMode(product_URL);
      } catch (error) {
        console.error("Normal mode failed: ", error.message);
      }
    } else {
      console.error(
        "Fast Mode failed for non-Cloudflare reason : ",
        error.message
      );
    }
  }
}
