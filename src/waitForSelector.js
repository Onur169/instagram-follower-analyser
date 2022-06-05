const successfullyLoggedInSelector = `img[alt*="${process.env.NAME}"]`;
const maxTimeoutForSelectorWait = 5000;
const loginFormSelector = "#loginForm";
const followersDialogSelector = "div[role=dialog]";
const waitForSelectorConfig = {
  timeout: maxTimeoutForSelectorWait,
};

function waitForLoggedInSelector(page) {
  return page.waitForSelector(
    successfullyLoggedInSelector,
    waitForSelectorConfig
  );
}

function waitForLoginFormSelector(page) {
  return page.waitForSelector(loginFormSelector, waitForSelectorConfig);
}

function waitForFollowersDialogSelector(page) {
  return page.waitForSelector(followersDialogSelector, waitForSelectorConfig);
}

module.exports = {
  successfullyLoggedInSelector,
  maxTimeoutForSelectorWait,
  loginFormSelector,
  followersDialogSelector,
  waitForLoginFormSelector,
  waitForLoggedInSelector,
  waitForFollowersDialogSelector
};
