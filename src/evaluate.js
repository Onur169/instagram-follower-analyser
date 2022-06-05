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
        if(typeof buttons === "undefined") {
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

module.exports = { findButtonAndClick, findFollowers };
