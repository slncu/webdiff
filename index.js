const puppeteer = require("puppeteer");
const looksSame = require("looks-same");

const [_, __, URL1, URL2] = process.argv;

/**
 * バリデーション
 */
if (URL1 === undefined) {
  console.error("1つの目のURLを設定してください");
  process.exit(1);
}

if (URL2 === undefined) {
  console.error("2つの目のURLを設定してください");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const pathA = "dist/a.png";
  const pathB = "dist/b.png";
  const pathDiff = "dist/diff.png";
  await page.goto(URL1);
  await page.screenshot({ path: pathA, fullPage: true });
  await page.goto(URL2);
  await page.screenshot({ path: pathB, fullPage: true });

  await new Promise((resolve, reject) =>
    looksSame.createDiff(
      {
        reference: pathA,
        current: pathB,
        diff: pathDiff,
        highlightColor: "#ff00ff",
      },
      (error) => (error ? reject() : resolve())
    )
  );

  await browser.close();
})();
