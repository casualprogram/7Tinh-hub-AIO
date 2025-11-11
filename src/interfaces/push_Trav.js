import fetchCactusJack from "../modules/trav_bot/fetch/fetch.js";

/**
 * @description - This function is the interface, connected to the CLI.
 *               It is responsible for calling the functions that fetch the weekly trending and send to discord.
 */
export default async function push_trav_status() {
  console.log("\t\tFetching Weekly Trending");
  await fetchCactusJack();
}
