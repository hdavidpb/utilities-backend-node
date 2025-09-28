import puppeteer from "puppeteer";

import randomUserAgent from "random-user-agent";


const EMAIL = process.env.USER_EMAIL;
const PASSWORD = process.env.USER_PASSWORD;

const browserInitialization = async (browserUrl) => {
  const header = randomUserAgent();
  const browser = await puppeteer.launch({args:[
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--no-zygote",
    "--single-process"
  ]});
  const page = await browser.newPage();
  await page.setUserAgent({
    userAgent: header,
  });
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(browserUrl);

  return { page, browser };
};

export const commonUtilitiesInit = async (browserUrl) => {
  try {
    const { page, browser } = await browserInitialization(browserUrl);

    const emailInput = await page.$('input[type="text"]');
    const passwordInput = await page.$('input[type="password"]');
    await emailInput.type(EMAIL);
    await passwordInput.type(PASSWORD);
    await page.click('button[text="Login"]');

    const getUtilitiesPromise = new Promise((resolve) => {
      setTimeout(async () => {
        const body = await page.waitForSelector(".md-body");
        const items = (await body.$$("tr")).slice(1);
        let aaaUtilities = [];
        for (const item of items) {
          const cells = (await item.$$("td")).slice(2, 8);
          let row = [];
          for (const cell of cells) {
            const hasSpan = await cell.$("span");
            if (hasSpan) {
              const icon = await hasSpan.$("i");
              const iconTooltip = await icon.evaluate((el) =>
                el.getAttribute("tooltip")
              );
              row.push(iconTooltip);
              continue;
            }
            const text = await cell.evaluate((el) => el.textContent.trim());
            row.push(text);
          }
          aaaUtilities.push(row);
        }
        resolve(aaaUtilities);
        await browser.close();
      }, 20000);
    });
    return await getUtilitiesPromise;
  } catch (error) {
    console.log("ERROR: ", error);
    return [];
  }
};

export const gasesDelCaribeInit = async (browserUrl) => {
  try {
    const { page, browser } = await browserInitialization(browserUrl);

    await page.click('button[id="NoAuthHeader_button_login"]');

    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    await emailInput.type(EMAIL);
    await passwordInput.type(PASSWORD);
    await page.click('button[type="submit"]');

    const getUtility = new Promise((resolve) => {
      setTimeout(async () => {
        let arr = [];
        const paragraphs = await page.$$("p");
        for (const p of paragraphs) {
          const text = await p.evaluate((el) => el.textContent.trim());
          arr.push(text);
        }
        const utility =  {
            date: arr[4],
            total: arr[9],
            status: arr[8],
            contract: arr[1],
         }
        ;
        resolve(utility);
        browser.close();
      }, 6000);
    });

    return await getUtility;

  } catch (error) {
    return [];
  }
};
