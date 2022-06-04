const successfullyLoggedInSelector = `img[alt*="${process.env.NAME}"]`;
const maxTimeoutForSelectorWait = 3000;
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
  waitForLoginFormSelector,
  waitForLoggedInSelector,
};
