# 7Tinh Hub Automation

<img width="543" alt="Screenshot 2025-02-23 at 10 19 53 PM" src="https://github.com/user-attachments/assets/b727687a-2ef9-4980-af14-5f53bd6259d0" />


###Overview
This bot is a Node.js-based web scraping tool designed to help 7Tinh Hub community keep up with fashion/sneaker hot news. While there are many excited plans coming up, it is still in early building process. Some of the features including delivery news and hot information, implementing AI to legit check item and more,...

This project is ideal for developers interested in web scraping, automation, and integrating with Discord for real-time notifications.


## Features
### Modules 1 - Fetch data
Scrapes news articles (e.g., headlines, images, URLs) using Puppeteer.
Filters news to include only items posted within 1–23 hours, excluding timestamps from the output.
Saves scraped data to src/data/source1/stories.json for persistence or further processing.
Supports potential integration with Discord for sending formatted news updates (configuration in progress).
Uses ES Modules for modern JavaScript development with "type": "module" in package.json.

### Modules 2 - Legit check with LLMs
Coming soon...



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


## Project Structure

```
/
├── src/
│   ├── modules/
│   │   ├── fetch/
│   │   │   └── source1.js        # Main scraping logic
│   │   ├── helper/
│   │   │   ├── delay.js          # Delay utility
│   │   │   └── formatting_data.js # Data formatting (if applicable)
│   ├── discord_msg/
│   │   └── news_notify.js        # Discord integration (optional)
│   └── data/
│       └── source1/
│           └── stories.json      # Scraped data storage (ignored by .gitignore)
├── .env                          # Environment variables (ignored by .gitignore)
├── .gitignore                    # Ignores sensitive/local files
├── package.json                  # Project dependencies and scripts
└── README.md                     # This file
```




*Project by Casual Soltions ©️*
*FOLLOW US -> [X](https://x.com/CasualAIO)*