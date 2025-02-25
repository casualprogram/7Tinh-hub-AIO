import inquirer from 'inquirer';

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

