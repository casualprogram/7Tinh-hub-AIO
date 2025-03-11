
import gradient from 'gradient-string';
import figlet from 'figlet';
import askUser from './fetch_news/helper/user_answer.js';      
import push_news from '../interfaces/push_news.js';
import push_stock from '../interfaces/push_stock.js';
import push_release_info from '../interfaces/push_release.js';


/**
 * @description - This function is the CLI interface.
 * It is responsible for calling the functions that fetch the data from the source and format it.
 * It also calls the function that asks the user to choose a module.
 */
async function CLI_Interface() {

    const welcomeMsg = "7tinh Hub tools";

    const welcomeText = await figlet.text(welcomeMsg, {
        font: "Standard", // Default font, or pick one you like
        horizontalLayout: "smushing",
        verticalLayout: "smushing",
        width: 80,
        whitespaceBreak: true,
      });
      console.log(gradient.pastel.multiline(welcomeText));
      console.log(gradient.pastel.multiline("\t \t \t \t \t \tpowered by casual solutions\n"));
    const optionFromUser = await askUser(); //fetch stock
 
    switch(optionFromUser.player_option){
        case ('1. Push News'):
            console.log(" RUNNING NEWS MODULE");
            push_news();
            break;
        case('2. Fetch Stock'):
            console.log("RUNNING STOCK MODULE");
            push_stock();
            break;
        case('3. Fetch Release Info'):
            console.log("RUNNING RELEASE MODULE");
            push_release_info();
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
