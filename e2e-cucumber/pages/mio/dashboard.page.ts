import { Page, Locator } from "@playwright/test";

export default class MIODashboardPage {
  readonly page: Page;
  readonly newEventBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newEventBtn = this.page.getByRole('button', { name: 'New event' });
  }

  async openCreateEventPage() {
    await this.newEventBtn.click();
  }
}