import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, ChromiumBrowser } from "playwright";
import { ICustomWorld } from "./custom-world";

setDefaultTimeout(20000);

let browser: ChromiumBrowser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false, slowMo: 200 });
});

Before(async function (this: ICustomWorld) {
  this.context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
  });
  this.page = await this.context.newPage();
});

After(async function (this: ICustomWorld) {
  await this.context?.close();
  await this.page?.close()
});

AfterAll(async function () {
  await browser.close();
});