const puppeteer = require("puppeteer");
const fs = require("fs").promises;
require("dotenv").config();
const { findButtonAndClick, findFollowers } = require("./src/evaluate");
const {
  maxTimeoutForSelectorWait,
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
  const instagramFollowersUrl = `${process.env.INSTAGRAM_STARTPAGE}/${process.env.NAME}/followers/`;
  const inputUsernameSelector = 'input[name="username"]';
  const inputPasswordSelector = 'input[name="password"]';
  const cookiesPath = "./cookies.json";
  let deletedExistingCookie = false;

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  const handleLoginThroughCookie = async () => {
    return new Promise(async (resolve) => {
      try {
        const cookiesString = await fs.readFile(cookiesPath);
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        resolve(true);
      } catch (error) {
        resolve(false);
      }
    });
  };

  const handleFollowersPage = async () => {
    await findButtonAndClick(page, "Aktivieren");
    await page.goto(instagramFollowersUrl);
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForSelector("div[role=dialog]", maxTimeoutForSelectorWait);
    try {
      const followers = await findFollowers(page, "Entfernen");
      console.log("Follower-List", followers);
    } catch (error) {
      console.error("Cannot retrieve followers list", error);
    }
  };

  const handleWaitForLoggedInSelector = async (cookieExists) => {
    await waitForLoggedInSelector(page)
      .then(() => {
        handleFollowersPage();
      })
      .catch(async (err) => {
        if (cookieExists) {
          await fs.unlink(cookiesPath);
          deletedExistingCookie = true;
        }
      });
  };

  const run = async () => {
    const cookieExists = !!(await fs.stat(cookiesPath).catch((e) => false));
    const alreadyLoggedIn = await handleLoginThroughCookie();
    if (!alreadyLoggedIn) {
      await page.goto(instagramLoginUrl);
      await waitForLoginFormSelector(page);
      await findButtonAndClick(page, "Erforderliche");
      await page.type(inputUsernameSelector, process.env.USERNAME);
      await page.type(inputPasswordSelector, process.env.PASSWORD);
      await findButtonAndClick(page, "Anmelden");
      await handleWaitForLoggedInSelector(cookieExists);
      await fs.writeFile(
        cookiesPath,
        JSON.stringify(await page.cookies(), null, 2)
      );
      await handleFollowersPage();
    } else {
      await page.goto(process.env.INSTAGRAM_STARTPAGE);
      await handleWaitForLoggedInSelector(cookieExists);
    }
  };

  try {
    run();
    if (deletedExistingCookie) {
      console.log("Run second time");
      run();
    }
  } catch (error) {
    console.error(error);
  } finally {
    await sleep(1000000);
    await browser.close();
  }
})();
