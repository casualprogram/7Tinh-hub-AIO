const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const discordWebhookUrl = process.env.DISCORD_WEBHOOK;

// Utility function to introduce delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendWebhook(headline, imageURL) {
  const webhookUrl = discordWebhookUrl;
  try {
    const embed = {
      title: 'TinTang News',
      color: 5763719,
      fields: [
        {
          name: 'Headline',
          value: `${headline}`,
          inline: true,
        }
      ],
      thumbnail: {
        url: imageURL,
      },
      footer: {
        text: 'powered by Casual Solutions',
        icon_url: 'https://pbs.twimg.com/profile_images/1398475007584444418/GRPcs63v_400x400.jpg',
      },
      timestamp: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

    const response = await axios.post(webhookUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const remainingRequests = response.headers['x-ratelimit-remaining'];
    const resetTime = response.headers['x-ratelimit-reset'];

    console.log(`Remaining requests: ${remainingRequests}`);
    console.log(`Rate limit resets at: ${new Date(resetTime * 1000)}`);

    if (remainingRequests === '0') {
      const retryAfter = response.headers['retry-after'];
      console.log(`Rate limited! Retrying after ${retryAfter} milliseconds.`);
      await delay(retryAfter); // Wait for the time specified in the `Retry-After` header
    }

  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      console.log(`Rate limited! Retry after ${retryAfter} milliseconds.`);
      await delay(retryAfter); // Wait for the specified time before retrying
      await sendWebhook(headline, imageURL); // Retry the webhook after waiting
    } else {
      console.error('Error sending webhook:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  }
}

module.exports = sendWebhook;
