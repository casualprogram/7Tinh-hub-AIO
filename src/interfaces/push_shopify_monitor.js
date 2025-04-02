import read_line from '../modules/module_util/read_line.js';
import inquirer from 'inquirer';
import oneSite from '../modules/shopify_monitor/fetch/one_sites.js'
import multiShopifyMonitor from '../modules/shopify_monitor/fetch/multi_sites.js'

export default async function push_shopify_monitor(){
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'player_option',
        message: 'Pick a shopify minitor module',
        choices: [
            '1. Domain Change Mode',
            '2. Regular Mode'
        ],
        default() {
            return 'Error';
        },
    });
    console.log("\n\t\tYOU PICK -> ", answer.player_option);

    if (answer.player_option == '1. Domain Change Mode') {
        const site = await read_line("\t\tEnter the site: ");
        oneSite(site);
    }
    else if (answer.player_option == '2. Regular Mode') {
        multiShopifyMonitor();
    }

}