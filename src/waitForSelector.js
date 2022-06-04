const successfullyLoggedInSelector = `img[alt*="${process.env.NAME}"]`;
const maxTimeoutForSelectorWait = 5000;
const loginFormSelector = "#loginForm";
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

module.exports = {
  successfullyLoggedInSelector,
  maxTimeoutForSelectorWait,
  loginFormSelector,
  waitForLoginFormSelector,
  waitForLoggedInSelector,
};
