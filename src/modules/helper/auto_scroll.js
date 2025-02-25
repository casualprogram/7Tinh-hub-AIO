import delay from './delay.js';


// Auto-scroll function
export default async function autoScroll(page) {
    let previousCardCount = 0;
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
        const currentCardCount = await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
            return document.querySelectorAll('.megaFeedCard').length;
        });

        console.log(`Scroll attempt ${i + 1}: Found ${currentCardCount} story cards`);

        if (currentCardCount > 0 && currentCardCount === previousCardCount) {
            console.log("Cards found and no new ones loaded, stopping scroll.");
            break;
        }
        if (i === maxAttempts - 1) {
            console.log("Max attempts reached, stopping scroll. Cards found, please contact the Devs", currentCardCount);
            break;
        }
        previousCardCount = currentCardCount;
        await delay(3000);
    }

    await delay(2000);
}
