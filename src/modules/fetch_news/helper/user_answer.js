import inquirer from 'inquirer';


/**
 * @description This function is responsible for asking the user to choose a module
 * @returns the user choice
 */
export default async function askUser(){

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'player_option',
        message: 'Pick a module',
        choices: [
            '1. Push News',
            '2. Fetch Stock',
            '3. Option C',
            'Exit'
        ],
        default() {
            return 'Error';
        },
    });
    
    return answer;
    
}

