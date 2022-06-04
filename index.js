const puppeteer = require("puppeteer");
const fs = require("fs").promises;
require("dotenv").config();
const { findButtonAndClick } = require("./src/evaluate");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  const instagramLoginUrl = `${process.env.INSTAGRAM_STARTPAGE}/accounts/login/`;
  const maxTimeoutForSelectorWait = 3000;
  const inputUsernameSelector = 'input[name="username"]';
  const inputPasswordSelector = 'input[name="password"]';
  const loginFormSelector = "#loginForm";
  const successfullyLoggedInSelector = `img[alt*="${process.env.NAME}"]`;
  const cookiesPath = "./cookies.json";
  const waitForSelectorConfig = {
    timeout: maxTimeoutForSelectorWait,
  };

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  let hasAlreadyLoggedIn;
  try {
    const cookiesString = await fs.readFile(cookiesPath);
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    hasAlreadyLoggedIn = true;
  } catch (error) {
    hasAlreadyLoggedIn = false;  
  }

  try {

    if (!hasAlreadyLoggedIn) {
      await page.goto(instagramLoginUrl);
      await page.waitForSelector(loginFormSelector, waitForSelectorConfig);
      await findButtonAndClick(page, "Erforderliche");
      await page.type(inputUsernameSelector, process.env.USERNAME);
      await page.type(inputPasswordSelector, process.env.PASSWORD);
      await findButtonAndClick(page, "Anmelden");
      await page.waitForSelector(
        successfullyLoggedInSelector,
        waitForSelectorConfig
      );
      const cookies = await page.cookies();
      await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
      await findButtonAndClick(page, "Aktivieren");
    } else {
      page.goto(process.env.INSTAGRAM_STARTPAGE);
      await page.waitForSelector(
        successfullyLoggedInSelector,
        waitForSelectorConfig
      );
      await findButtonAndClick(page, "Aktivieren");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await sleep(1000000);
    await browser.close();
  }
})();
