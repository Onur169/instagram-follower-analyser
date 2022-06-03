const puppeteer = require("puppeteer");
require("dotenv").config();
const { findButtonAndClick } = require("./src/evaluate");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  const instagramLoginUrl = "https://www.instagram.com/accounts/login/";
  const maxTimeoutForSelectorWait = 3000;
  const inputUsernameSelector = 'input[name="username"]';
  const inputPasswordSelector = 'input[name="password"]';
  const loginFormSelector = "#loginForm";
  const waitForSelectorConfig = {
    timeout: maxTimeoutForSelectorWait,
  };

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  try {
    const hasAlreadyLoggedIn = false;

    if (!hasAlreadyLoggedIn) {
      await page.goto(instagramLoginUrl);
      await page.waitForSelector(loginFormSelector, waitForSelectorConfig);

      await findButtonAndClick(page, "Erforderliche");

      await page.type(inputUsernameSelector, process.env.USERNAME);
      await page.type(inputPasswordSelector, process.env.PASSWORD);

      await findButtonAndClick(page, "Anmelden");

    } else {
      console.log("Has already logged in");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await sleep(1000000);
    await browser.close();
  }
})();
