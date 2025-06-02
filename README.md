# 7Tinh Hub Automation

<img width="543" alt="Screenshot 2025-02-23 at 10 19 53 PM" src="https://github.com/user-attachments/assets/b727687a-2ef9-4980-af14-5f53bd6259d0" />

### Overview

This bot is a Node.js-based web scraping tool designed to help 7Tinh Hub community keep up with fashion/sneaker hot news. While there are many excited plans coming up, it is still in early building process. Some of the features including delivery news and hot information, implementing AI to legit check item and more,...

This project is ideal for developers interested in web scraping, automation, and integrating with Discord for real-time notifications.

NOTICE : a lot of private request API and URL/Key has been hide for safety purpose. If you interested in learning more on each specific module and how it works. Feel free to send me a message on twitter :D !

## Features

### Modules 1 - Fetch news data

Scrapes news articles (e.g., headlines, images, URLs) using Puppeteer.
Filters news to include only items posted within 1–23 hours, excluding timestamps from the output.
Saves scraped data to src/data/source1/stories.json for persistence or further processing.
Supports potential integration with Discord for sending formatted news updates (configuration in progress).
Uses ES Modules for modern JavaScript development with "type": "module" in package.json.

### Modules 2 - fetch release / raffle info

Require an SKU for a specific shoe
Scrapping sites that will release a specific shoes.
Send msg to discord with all the information such as release time, release method.

### Modules 3 - fetch snkrs checkout URL

Require an SKU for a specific shoe on SNKRS app
Fetch early checkout link for SNKRS, support multiple entries (for future development)
Send checkout url into Discord so member con be benefit

### Modules 4 - fetch SNKRS stock

Require an SKU for a specific shoe release soon on SNKRS app
This will fetch the stock amount that loads in the backend of Nike.
Give member an estimate of what size will be the most stock compare to others

### Modules 4 - fetch weekly ranking / trending for sneakers.

This will fetch the top 10 most popular / talks about sneaker in that week.
Give member an update on which pair would be hype up upcoming weeks, which pair is die down from the hype

### Modules 5 - Generated SNKRS early checkout url.

This module help user generated any SNKRS raffle checkout url way before the raffle is open. This potential help the user take advantage quick raffle enter, increase chances to cop a hype sneaker in a small window raffle.

### Modules 6 - run shopify monitor.

This module will monitor any shopify site for any new loading product, restock product. At the same time, this module will also generate checkout link, help push the user to the direct checkout page, put user in advantage position comapre with regualar user.
Also work with Domain changes website

### Modules 7 - fetch Shopify checkout link.

This module will take any product url and generate the checkout link for that product. At the same time, it would also being able to take any shopify page and generate checkout link for the latest 50 produces loaded on the website.
This to help fulfill the module 6, shopify monitor, incase of proxy banned, we still being able to help user with checkout link.

## Prerequisites

Node.js: Version 18 or later (preferably arm64 for Apple Silicon Macs to optimize Puppeteer performance).
npm: Comes with Node.js.
Git: For cloning the repository.
Puppeteer Dependencies: Ensure Chrome/Chromium is installed on your system, or Puppeteer will download it automatically.

## Installation

**Clone the repo**

```
git clone https://github.com/casualprogram/tin-news-bot.git
cd tin-news-bot
```

**Install dependencies**

```
npm install
```

**Set up environment variables**
Create a .env file in the project root:

> Ensure the .env file is added to .gitignore to prevent sensitive data from being committed.

**Verify Node.js architecture (for Apple Silicon Macs)**

> Check your Node.js architecture

```
node -p "process.arch"
```

If it outputs x64, install an arm64 version of Node.js (see setup instructions in the project issues or documentation) to optimize Puppeteer performance and avoid Rosetta translation warnings

**Verify Node.js architecture (for Apple Silicon Macs)**

> Run the bot with

```
npm start
```

## Project Structure

```

📦 7TinhHub-AIO
├─ .gitignore
├─ README.md
├─ jest.config.js
├─ jest.setup.js
├─ jsconfig.json
├─ package-lock.json
├─ package.json
└─ src
   ├─ index.js
   ├─ interfaces            // Store interfaces for each module
   │  ├─ push_checkout_url
   │  ├─ push_news
   │  ├─ push_release
   │  ├─ push_stock
   │  └─ push_trending.js
   └─ modules                // Each module logic, including fetch and send msg
      ├─ CLI.js              // CLI config and end point to run.
      ├─ fetch_news
      ├─ fetch_raffle
      ├─ fetch_Shopify_ATC
      ├─ fetch_snkrs_checkout
      ├─ fetch_stock
      ├─ fetch_trending
      ├─ fetch_snkrs_checkout
      ├─ fetch_stock
      ├─ fetch_trending
      └─ module_util        // helper function for every module
         ├─ auto_scroll.js
         ├─ delay.js
         ├─ read_line.js
         └─ user_answer.js

```

_Project by Casual Soltions ©️_
_FOLLOW US -> [X](https://x.com/CasualAIO)_
