import axios from "axios";
import FormData from "form-data";
import { resolve } from "path";
import delay from "../../module_util/delay.js";
import dotenv from "dotenv";

dotenv.config({ path: resolve("../../../../.env") });

/**
 * @description Sends messages to TinTang community with ATC links.
 * @param {string} productPhoto - URL of the product image.
 */
export default async function sendWebhook(
  atcLinks,
  productPhoto,
  productTitle
) {
  const webhookUrl = process.env.SHOPIFY_ATC_DISCORD_WEBHOOK;

  try {
    // Format ATC links into a Discord-friendly string
    const onePrice =
      atcLinks[0]?.price != null
        ? atcLinks[0].price
        : atcLinks[1]?.price != null
        ? atcLinks[1].price
        : null;

    const sizeString = atcLinks
      .map(({ size, atcLink }) => `[${size}](${atcLink})`)
      .join("\n");
    const formattedSizeString = `\n${sizeString}\n`; // Wrap in a code block

    const embed = {
      title: productTitle,
      description: `$${onePrice}` || "No price available",
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
      fields: [
        {
          name: "Check Out Link",
          value: `${formattedSizeString}` || "No ATC links available",
          inline: false,
        },
      ],
      footer: {
        text: "powered by Casual Solutions",
        icon_url:
          "https://pbs.twimg.com/profile_images/1398475007584444418/GRPcs63v_400x400.jpg",
      },
      timestamp: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("payload_json", JSON.stringify({ embeds: [embed] }));

    const response = await axios.post(webhookUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const remainingRequests = response.headers["x-ratelimit-remaining"];

    if (remainingRequests === "0") {
      const retryAfter = response.headers["retry-after"];
      console.log(`Rate limited! Retrying after ${retryAfter} milliseconds.`);
      await delay(retryAfter);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      console.log(`Rate limited! Retrying after ${retryAfter} milliseconds.`);
      await delay(retryAfter);
      await sendWebhook(atcLinks, productPhoto, productTitle);
    } else {
      console.error("Error sending webhook:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
      }
    }
  }
}
