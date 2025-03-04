import readline from 'readline';

/**
 * @description Read a line from the terminal and return the answer as a string.
 * @param {*} prompt_question  - The question to ask the user.
 * @returns  - The answer from the user.
 */
export default async function read_line(prompt_question){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await new Promise((resolve) => {
        rl.question(prompt_question, (answer) => {
            resolve(answer);
            rl.close();
        });
    });
    
    return answer;
}