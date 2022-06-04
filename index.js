const puppeteer = require("puppeteer");
const fs = require("fs").promises;
require("dotenv").config();
const { findButtonAndClick } = require("./src/evaluate");
const {
  waitForLoginFormSelector,
  waitForLoggedInSelector,
} = require("./src/waitForSelector");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  const instagramLoginUrl = `${process.env.INSTAGRAM_STARTPAGE}/accounts/login/`;
  const inputUsernameSelector = 'input[name="username"]';
  const inputPasswordSelector = 'input[name="password"]';
  const cookiesPath = "./cookies.json";

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
      await waitForLoginFormSelector(page);
      await findButtonAndClick(page, "Erforderliche");
      await page.type(inputUsernameSelector, process.env.USERNAME);
      await page.type(inputPasswordSelector, process.env.PASSWORD);
      await findButtonAndClick(page, "Anmelden");
      await waitForLoggedInSelector(page);
      await fs.writeFile(
        cookiesPath,
        JSON.stringify(await page.cookies(), null, 2)
      );
      await findButtonAndClick(page, "Aktivieren");
    } else {
      page.goto(process.env.INSTAGRAM_STARTPAGE);
      await waitForLoggedInSelector(page);
      await findButtonAndClick(page, "Aktivieren");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await sleep(1000000);
    await browser.close();
  }
})();
