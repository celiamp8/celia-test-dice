import { Page, Locator, expect } from "@playwright/test";

export default class FanEventPage {
  readonly page: Page;
  readonly buyTicketBtn: Locator;
  readonly checkoutBtn: Locator;
  readonly purchaseTicketsBtn: Locator;
  readonly popupOkBtn: Locator;

  // Form fields for payment details:
  readonly paymentHeading: Locator;
  readonly postcode: Locator;


  constructor(page: Page) {
    this.page = page;
    this.buyTicketBtn = this.page.getByRole('button', { name: 'Buy now' });
    this.checkoutBtn = this.page.locator('button').locator('text=Checkout');
    this.purchaseTicketsBtn = this.page.getByRole('button', { name: 'Purchase Tickets' });
    this.popupOkBtn = this.page.getByRole('button', { name: 'OK', exact: true });

    this.paymentHeading = this.page.getByRole('heading', { name: 'Pay with card' });
    this.postcode = this.page.getByPlaceholder('Postcode / Zipcode');
  }

  async validateEventName(eventName: string) {
    await expect(this.page.getByRole('heading', { name: eventName })).toContainText(eventName);
  }

  async selectTicketToPurchase(ticketType: string) {
    await this.buyTicketBtn.click();
    // If a pop-up appears with a notification for another event we have tickets for, close it
    if (await this.popupOkBtn.isVisible()) {
      await this.popupOkBtn.click();
    }
    await this.page.locator('div').locator('text=' + ticketType).click();

    await this.checkoutBtn.click();

  }

  async enterPaymentData(user: any) {
    // Because of Stripe's dynamic iframe names, the alternative coded here is to click on the payment heading and hit TAB to navigate to the card data inputs
    await this.paymentHeading.click();
    await this.page.locator('body').press('Tab');
    await this.page.locator('body').type(user.cardData);
    await this.postcode.fill(user.postCode);
  }
}