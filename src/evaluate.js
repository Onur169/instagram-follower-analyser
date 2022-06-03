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

module.exports = { findButtonAndClick };
