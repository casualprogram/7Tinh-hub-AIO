import axios from "axios";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: resolve("../../../../.env") });

export default async function sendErrorNotification(moduleName, error) {
  const bot_noti = process.env.DISCORD_BOT_NOTI_WEBHOOK;
  if (!bot_noti) {
    console.error("[Error Notification] DISCORD_BOT_NOTI_WEBHOOK is not set.");
    return;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const payload = {
    content: `**${moduleName}** module got an error.\n\`\`\`${errorMessage}\`\`\`\nPlease contact the Dev to fix.`,
  };

  try {
    await axios.post(bot_noti, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`[Error Notification] Sent to Discord for: ${moduleName}`);
  } catch (notificationError) {
    console.error(
      "[Error Notification] Failed to send to Discord:",
      notificationError.message
    );
  }
}
