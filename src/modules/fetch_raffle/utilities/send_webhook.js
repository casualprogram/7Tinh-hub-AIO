import axios from "axios";
import FormData from "form-data";
import { resolve } from "path";
import delay from "../../module_util/delay.js";
import dotenv from "dotenv";

dotenv.config({ path: resolve("../../../../.env") });

/**
 * @description - This function sends messages to TinTang community.
 * @param {string} productTitle - The headline of the story.
 * @param {string} productPhoto - The image of the story.
 * @param {Array} retailers - Array of retailer objects with name, timeOfRelease, and releaseType.
 */
export default async function sendWebhook(
  productTitle,
  productPhoto,
  retailers
) {
  // The Discord webhook
  const webhookUrl = process.env.RELEASE_INFO_DISCORD;

  try {
    // Generate retailer lines
    const retailerLines = retailers
      .map((retailer) => {
        const time =
          retailer.timeOfRelease.replace(/N\/A\s*/g, "").trim() || "N/A";
        const type = retailer.releaseType.trim() || "N/A";
        return `--------\n**${retailer.name}**  \n**Time** : ${time}  \n**Release Method** : ${type}\n--------`;
      })
      .filter((line) => !line.includes("N/A - N/A")); // Exclude lines where both are N/A

    // Split into chunks ≤1024 characters
    const maxFieldLength = 1024;
    const fieldContents = [];
    let currentField = "";

    for (const line of retailerLines) {
      const potentialField = currentField ? `${currentField}\n${line}` : line;
      if (potentialField.length <= maxFieldLength) {
        currentField = potentialField;
      } else {
        if (currentField) {
          fieldContents.push(currentField);
        }
        currentField = line;
      }
    }
    if (currentField) {
      fieldContents.push(currentField);
    }

    // Create fields array
    const fields =
      fieldContents.length > 0
        ? fieldContents.map((value, index) => ({
            name: fieldContents.length > 1 ? `` : "Release Info\n",
            value,
          }))
        : [{ name: "Release Info", value: "No release information available" }];

    const embed = {
      title: `${productTitle}`,
      color: 5763719,
      author: {
        name: "7tinh Hub",
        icon_url:
          "https://media.discordapp.net/attachments/1303904551417413642/1343342344086224906/image.png?ex=67bcec8c&is=67bb9b0c&hm=eb9327c9c3e61e714d710a34c2f64dc5506452adb696ffe6420503200d634ef2&=&format=webp&quality=lossless&width=653&height=278",
        url: "https://www.youtube.com/@ttintang",
      },
      image: {
        url: productPhoto,
      },
      fields,
      footer: {
        text: "powered by Casual Solutions",
        icon_url:
          "https://pbs.twimg.com/profile_images/1398475007584444418/GRPcs63v_400x400.jpg",
      },
      timestamp: new Date().toISOString(),
    };

    // Create a FormData object to send the embed message
    const formData = new FormData();
    formData.append("payload_json", JSON.stringify({ embeds: [embed] }));

    // Send the webhook message
    const response = await axios.post(webhookUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Log the remaining requests and the rate limit reset time
    const remainingRequests = response.headers["x-ratelimit-remaining"];
    const resetTime = response.headers["x-ratelimit-reset"];
    console.log(`Rate limit resets at: ${new Date(resetTime * 1000)}`);

    // If the remaining requests are 0, we are being rate limited by Discord
    if (remainingRequests === "0") {
      const retryAfter = response.headers["retry-after"];
      console.log(`Rate limited! Retrying after ${retryAfter} milliseconds.`);
      await delay(retryAfter); // Wait for the time specified in the `Retry-After` header
    }
  } catch (error) {
    // If the error is a 429 (rate limit exceeded) error
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      console.log(`Rate limited! Retry after ${retryAfter} milliseconds.`);
      await delay(retryAfter); // Wait for the specified time before retrying
      await sendWebhook(productTitle, productPhoto, retailers); // Retry the webhook after waiting
    } else {
      // Log the error if it is not a rate limit error
      console.error("Error sending webhook:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  }
}
