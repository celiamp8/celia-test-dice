import { setWorldConstructor, World, IWorldOptions, setDefaultTimeout } from '@cucumber/cucumber';
import { BrowserContext, Page, PlaywrightTestOptions } from '@playwright/test';

// Timeout increased due to delays in the event displaying in the search menu
const DEFAULT_TIMEOUT = 80000;

setDefaultTimeout(DEFAULT_TIMEOUT);


export interface ICustomWorld extends World {
  context?: BrowserContext;
  page?: Page;

  playwrightOptions?: PlaywrightTestOptions;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
