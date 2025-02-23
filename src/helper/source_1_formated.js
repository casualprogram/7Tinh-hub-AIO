const fs = require("fs").promises;
const path = require("path")


const filepath = path.resolve("../data/source1/stories.json");
const sendWebhook = require('../discord_msg/news_notify');
const getFirstData = require('../scrap/source1');
const { send } = require("process");

async function formattedFirstData() {
    try{
        //
        const data = await fs.readFile(filepath, {encoding: "utf-8"});
        console.log("Data has been read successfully", data);

        const stories = JSON.parse(data);
        
        for (const story of stories) {
            console.log("Headline:", story.headline);
            await sendWebhook(story.headline, story.pictureUrl);
        console.log("Webhook sent successfully");
        }
  
    }
    catch(error){
        console.error("Error scraping data", error);
    }
}



formattedFirstData();