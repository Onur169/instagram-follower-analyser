function findButtonAndClick(page, innerHtmlSearchStr) {
  const args = { innerHtmlSearchStr };
  return page.evaluate((args) => {
    const foundButton = [...document.querySelectorAll("button")].filter(
      (item) => item.innerHTML.includes(args.innerHtmlSearchStr)
    );
    if (foundButton[0]) {
      const btn = foundButton[0];
      btn.click();
    }
  }, args);
}

function findFollowers(page, innerHtmlSearchStr) {
  return new Promise(async (resolve, reject) => {
    const args = { innerHtmlSearchStr };
    try {
      const followers = await page.evaluate((args) => {
        let collectFollowers = [];
        const buttons = document?.querySelectorAll("button");
        if (typeof buttons === "undefined") {
          reject("no buttons available");
        }
        [...buttons]
          .map((item) => {
            if (item.innerHTML.includes(args.innerHtmlSearchStr)) {
              const userElement = item.parentElement.previousSibling;
              return userElement;
            }
          })
          .filter((item) => item)
          .forEach((hyperlink) => {
            collectFollowers.push(hyperlink.querySelector("a").href);
          });
        return collectFollowers;
      }, args);
      console.info(followers);
      resolve(followers);
    } catch (error) {
      reject(error);
    }
  });
}

function findSelectorAndScrollDown(page, selector) {
  const args = { selector };
  return page.evaluate((args) => {
    let collectScrollHeights = [-1];
    let interval = setInterval(() => {
      const scrollableSection = document
        .querySelector(args.selector)
        .querySelector("ul").parentElement;
      console.log(scrollableSection);
      if (scrollableSection) {
        if (collectScrollHeights[collectScrollHeights.length - 1] === scrollableSection.scrollHeight) {
          clearInterval(interval);
        }
        scrollableSection.scrollTop = 0;
        scrollableSection.scrollTop = scrollableSection.scrollHeight;
        collectScrollHeights.push(scrollableSection.scrollHeight);
        console.log(
          scrollableSection.scrollHeight,
          scrollableSection.offsetHeight
        );
      }
    }, 1000);
  }, args);
}

module.exports = {
  findButtonAndClick,
  findFollowers,
  findSelectorAndScrollDown,
};
