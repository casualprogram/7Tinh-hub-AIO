// ──────  send_webhook.js  ──────
import axios from "axios";
import FormData from "form-data";

export default async function sendFailWebhook(message) {
  const WEBHOOK_URL =
    "https://discord.com/api/webhooks/1427084851126730882/6z42tqm8Z3w-lvkrA-LLveRGZqK2nEyVU4AU8XkLLsxZ_atTYPDCnYi6jg6ZTsjP0EE6";

  const payload = {
    embeds: [
      {
        title: "Travis Scott Raffle Status",
        description: message,
        color: 5763719, // Greenish
        footer: {
          text: "powered by Casual Solutions",
          icon_url:
            "https://pbs.twimg.com/profile_images/1398475007584444418/GRPcs63v_400x400.jpg",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await axios.post(WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const remaining = res.headers["x-ratelimit-remaining"];
    if (remaining === "0") {
      const retryAfter = res.headers["retry-after"] || 1000;
      console.log(`Rate limited. Waiting ${retryAfter}ms...`);
      await new Promise((r) => setTimeout(r, retryAfter));
    }
  } catch (error) {
    console.error("Webhook failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}
