import gradient from "gradient-string";
import figlet from "figlet";
import askUser from "./module_util/user_answer.js";
import push_news from "../interfaces/push_news.js";
import push_stock from "../interfaces/push_stock.js";
import push_release_info from "../interfaces/push_release.js";
import push_weekly_trending from "../interfaces/push_trending.js";
import push_checkout_url from "../interfaces/push_checkout_url.js";
import push_shopify_monitor from "../interfaces/push_shopify_monitor.js";
import push_ATC from "../interfaces/push_ATC.js";
import push_trav_status from "../interfaces/push_Trav.js";

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
  console.log(
    gradient.pastel.multiline("\t \t \t \t \t \tpowered by casual solutions\n")
  );
  const optionFromUser = await askUser(); //fetch stock

  switch (optionFromUser.player_option) {
    case "1. Push News":
      console.log(" RUNNING NEWS MODULE");
      push_news();
      break;
    case "2. Fetch Stock":
      console.log("RUNNING STOCK MODULE");
      push_stock();
      break;
    case "3. Fetch Release Info":
      console.log("RUNNING RELEASE MODULE");
      push_release_info();
      break;
    case "4. Fetch Weekly Trending":
      console.log("RUNNING TRENDING MODULE");
      push_weekly_trending();
      break;
    case "5. SNKRS Checkout Link":
      console.log("RUNNING SNKRS CHECKOUT MODULE");
      push_checkout_url();
      break;
    case "6. Shopify Monitor":
      console.log("RUNNING SHOPIFY MONITOR MODULE");
      push_shopify_monitor();
      break;
    case "7. Shopify Checkout Link":
      console.log("RUNNING SHOPIFY CHECKOUT LINK MODULE");
      push_ATC();
      break;
    case "8. Travis Scott Raffle Status":
      console.log("RUNNING TRAVIS SCOTT RAFFLE STATUS MODULE");
      push_trav_status();
      break;
    case "Exit":
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
