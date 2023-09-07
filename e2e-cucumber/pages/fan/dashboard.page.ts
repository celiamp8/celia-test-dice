import { Page, Locator, expect } from "@playwright/test";

export default class FanDashboardPage {
  readonly page: Page;
  readonly searchBtn: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBtn = this.page.getByRole('button', { name: 'Search' });
    this.searchInput = this.page.getByPlaceholder('Find an event');
  }

  async findEvent(eventName: string) {
    // Click on the search button in the menu -- this could be part of its own menu.page but for keeping the test simple I've left it in the Dashboard page
    await this.searchBtn.click();
    // Search for the desired event and select it - due to delays in the application, retry until the event appears
    await expect(async () => {
      await this.searchInput.click();
      await this.searchInput.fill('');
      await this.searchInput.fill(eventName);
      await expect(this.page.getByText(eventName)).toBeVisible();
    }).toPass();
    await this.page.getByText(eventName).click();
  }
}