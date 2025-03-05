import fetchStock from '../modules/fetch_stock/fetch/fetch_stock.js';
import read_line from '../modules/module_util/read_line.js';


/**
 * @description - This function is the interface, connected to the CLI.
 *               It is responsible for calling the functions that fetch the data from the source and format it.
 * @returns 
 */
export default async function push_stock(){

    const SKU = await read_line("Enter the SKU: ");
    console.log("\t\tReceived ->", SKU);

    await fetchStock(SKU);

}