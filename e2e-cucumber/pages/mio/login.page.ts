import { Page, Locator, expect } from "@playwright/test";

const MIO_LOGIN_WEBSITE = 'https://mio-aqa-candidates.dc.dice.fm/auth/login';

export default class MIOLoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly signInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = this.page.locator('input[name="email"]');
    this.password = this.page.locator('input[name="password"]');
    this.signInBtn = this.page.getByRole('button', { name: 'Sign in' });

  }

  // TODO Improvement - create user types for MIO/Fan users that constrain the data each can have
  async logIn(user: any) {
    await this.page.goto(MIO_LOGIN_WEBSITE);

    await this.email.type(user.email);
    await this.password.type(user.password);
    await expect(async () => {
      await expect(this.signInBtn).toBeVisible();
    }).toPass();
    await this.signInBtn.click();

  }
}