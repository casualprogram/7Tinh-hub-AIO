import path from 'path';
import gradient from 'gradient-string';
import figlet from 'figlet';
import askUser from './helper/user_answer.js';      
import push_news from '../interfaces/push_news.js';

const filepath = path.resolve("../data/source1/stories.json");


/**
 * @description - This function is the CLI interface.
 * It is responsible for calling the functions that fetch the data from the source and format it.
 * It also calls the function that asks the user to choose a module.
 */
async function CLI_Interface() {

    const welcomeMsg = "7tinh Hub tools";

    await figlet(welcomeMsg, function(err, data) {
        console.log(gradient.pastel.multiline(data));
        console.log(gradient.pastel.multiline("\t \t \t \t \t \tpowered by casual solutions\n"));
    }
    );

    const optionFromUser = await askUser();

    switch(optionFromUser.player_option){
        case ('Push News'):
            console.log("Push News");
            push_news();
            console.log("THEN SOURCE 1 MODULE RUNS")
            break; // for now
            
        case('Option B'):
            console.log("Option B");
            break;
        case('Option C'):
            console.log("Option C");
            break;
        case('Exit'):
            console.log(
                await figlet.text("BYE BYE!", {
                font: "Ghost",
                horizontalLayout: "smushing",
                verticalLayout: "smushing",
                width: 80,
                whitespaceBreak: true,
                })
            );
            
            break;
        default:
            console.log("Module not available");
            break;
    }
}

CLI_Interface();
