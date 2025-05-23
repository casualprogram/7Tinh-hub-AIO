import fetchATC from "../modules/fetch_Shopify_ATC/fetch/fetch_ATC.js";
import readline from "node:readline";
import isValidUrl from "../modules/fetch_Shopify_ATC/utilities/is_product_url.js";

export default async function push_checkout_url() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "\n\tEnter a Shopify URL (or type 'exit' to quit): ",
  });

  rl.prompt();

  // Handle input
  rl.on("line", async (line) => {
    const input = line.trim();
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    if (!isValidUrl(input)) {
      console.log("Invalid Shopify URL");
      console.log("\nPlease Try Again!");
      rl.prompt();
      return;
    }

    try {
      await fetchATC(input);
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
    }

    rl.prompt();
  });
}
