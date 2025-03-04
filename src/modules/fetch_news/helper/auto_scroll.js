import delay from '../../module_util/delay.js';

/**
 * @description - This function is responsible for scrolling the page to load more content.
 * @param {*} page - The page object. 
 */

export default async function autoScroll(page) {
    // Scroll the page to load more content
    let previousCardCount = 0;
    // Maximum number of attempts to scroll
    const maxAttempts = 10;
    // Scroll the page to load more content
    for (let i = 0; i < maxAttempts; i++) {
        const currentCardCount = await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
            return document.querySelectorAll('.megaFeedCard').length;
        });
        // Log the number of story cards found
        console.log(`Scroll attempt ${i + 1}: Found ${currentCardCount} story cards`);
        // If no new cards are loaded, stop scrolling
        if (currentCardCount > 0 && currentCardCount === previousCardCount) {
            console.log("Cards found and no new ones loaded, stopping scroll.");
            break;
        }
        // If the maximum number of attempts is reached, stop scrolling
        if (i === maxAttempts - 1) {
            console.log("Max attempts reached, stopping scroll. Cards found, please contact the Devs", currentCardCount);
            break;
        }
        // Update the previous card count and wait for the page to load
        previousCardCount = currentCardCount;
        await delay(3000);
    }

    await delay(2000);
}
