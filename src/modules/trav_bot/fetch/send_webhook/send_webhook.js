// ──────  send_webhook.js  ──────
import axios from "axios";
import FormData from "form-data";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: resolve("../../../../.env") });

const RAFFLE_ROLE_ID = "1303905348591292517"; // ← your role

export default async function sendWebhook(imageURL, productUrl) {
  try {
    // Build the mention string
    const roleMention = `<@&${RAFFLE_ROLE_ID}>`;
    const webhook =
      "https://discord.com/api/webhooks/1367175774175760564/HeyCeACufkbE7SC0thqvu9M4y5V2mcesmKi_OM0VtxFwDS2WPK14wXt7jH6GQNe42TnS";

    const embed = {
      title: "Travis Scott Raffle Alert",
      color: 5763719,
      description: `**Raffle is OPEN!** - [Enter Raffle Now](${productUrl})`,
      image: { url: imageURL },
      footer: {
        text: "powered by Casual Solutions",
        icon_url:
          "https://pbs.twimg.com/profile_images/1398475007584444418/GRPcs63v_400x400.jpg",
      },
      timestamp: new Date().toISOString(),
    };

    const payload = {
      content: roleMention, // appears above the embed
      embeds: [embed],
    };

    const form = new FormData();
    form.append("payload_json", JSON.stringify(payload));

    const res = await axios.post(webhook, form, {
      headers: form.getHeaders(),
    });

    // ---- Rate-limit handling (unchanged) ----
    const remaining = res.headers["x-ratelimit-remaining"];
    if (remaining === "0") {
      const retryAfter = res.headers["retry-after"];
      console.log(`Rate limited – retry after ${retryAfter} ms`);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      console.log(`Rate limited! Retrying after ${retryAfter} milliseconds.`);
      await delay(retryAfter);
      await sendWebhook(atcLinks, productPhoto, productUrl);
    } else {
      console.error("Error sending webhook:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
      }
    }
  }
}
