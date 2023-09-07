import { Page, expect } from "@playwright/test";

const FAN_TICKETS_WEBSITE = 'https://aqa-candidates.dc.dice.fm/tickets';

export default class FanTicketsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openTicketsWebsite() {
    await this.page.goto(FAN_TICKETS_WEBSITE);
  }

  async openTicket(eventName: string) {
    await this.page.locator('text=' + eventName).click();
  }

  async validateTicketInfo(event: any, ticketType: string) {
    await expect(this.page.locator('text=' + event.name)).toContainText(event.name);
    await expect(this.page.locator('strong').filter({ hasText: ticketType })).toContainText(ticketType);

  }
}