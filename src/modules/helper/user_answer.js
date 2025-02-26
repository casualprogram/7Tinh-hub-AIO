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
            'Push News',
            'Option B',
            'Option C',
            'Exit'
        ],
        default() {
            return 'Error';
        },
    });
    
    return answer;
    
}

