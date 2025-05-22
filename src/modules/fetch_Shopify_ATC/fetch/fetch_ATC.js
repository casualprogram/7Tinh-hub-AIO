import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import fastMode from "../utilities/fast_mode.js"; // Import your fastMode function
import normalMode from "../utilities/normal_mode.js";

// Resolve the path to your .env file
dotenv.config({ path: resolve("../../../../.env") });

async function fetchATC(product_URL) {
  try {
    console.log("Attemping fastMode...");
    await fastMode(product_URL);
    console.log("Fast mode completed successfully.");
    return true;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(
        "403 CloudFare Anti-bot is up -> Fast Mode failed, trying Normal Mode..."
      );
      try {
        await normalMode(product_URL);
        console.log("Normal mode completed successfully.");
        return true;
      } catch (error) {
        console.error("Normal mode failed: ", error.message);
        return false;
      }
    } else {
      console.error(
        "Fast Mode failed for non-Cloudflare reason : ",
        error.message
      );
      return false;
    }
  }
}

fetchATC(product);
