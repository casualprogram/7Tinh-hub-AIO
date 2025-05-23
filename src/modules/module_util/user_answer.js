import inquirer from "inquirer";

/**
 * @description This function is responsible for asking the user to choose a module
 * @returns the user choice
 */
export default async function askUser() {
  const answer = await inquirer.prompt({
    type: "list",
    name: "player_option",
    message: "Pickle a module",
    choices: [
      "1. Push News",
      "2. Fetch Stock",
      "3. Fetch Release Info",
      "4. Fetch Weekly Trending",
      "5. SNKRS Checkout Link",
      "6. Shopify Monitor",
      "7. Shopify Checkout Link",
      "Exit",
    ],
    default() {
      return "Error";
    },
  });

  return answer;
}
