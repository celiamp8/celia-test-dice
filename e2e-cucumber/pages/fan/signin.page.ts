import { Page, Locator, expect } from "@playwright/test";

const FAN_LOGIN_WEBSITE = 'https://aqa-candidates.dc.dice.fm/login';
const EXISTING_USER_MOBILE = '07541400868';

export default class FanSignInPage {
  readonly page: Page;

  // Phone input form
  readonly mobileNumber: Locator;
  readonly nextBtn: Locator;

  // OTP input modal
  readonly otp: Locator;

  // User details form
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly birthDate: Locator;
  readonly createAccountBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mobileNumber = this.page.getByPlaceholder('Mobile number');
    this.nextBtn = this.page.getByRole('button', { name: 'Next' });

    this.otp = this.page.getByTestId('modal-root').getByRole('textbox');

    this.firstName = this.page.getByPlaceholder('Your first name');
    this.lastName = this.page.getByPlaceholder('Your last name');
    this.email = this.page.getByPlaceholder('A valid email address');
    this.birthDate = this.page.getByPlaceholder('dd/mm/yyyy');
    this.createAccountBtn = this.page.getByRole('button', { name: 'Create Account' });
  }

  // TODO Improvement - create user types for MIO/Fan users that constrain the data each can have
  async signIn(user: any, mobileNumber: string) {
    await this.page.goto(FAN_LOGIN_WEBSITE);

    await this.mobileNumber.fill(mobileNumber);
    await this.nextBtn.click();

    await expect(async () => {
      await expect(this.otp).toBeVisible();
    }).toPass();
    await this.otp.fill(user.otp);

    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.birthDate.fill(user.birthDate);
    await this.createAccountBtn.click();
  }

  // Method created for debugging- can be used if preferred for not creating a user every time we run the tests
  async signInExistingUser(user: any) {
    await this.page.goto(FAN_LOGIN_WEBSITE);

    await this.mobileNumber.fill(EXISTING_USER_MOBILE);
    await this.nextBtn.click();

    await expect(async () => {
      await expect(this.otp).toBeVisible();
    }).toPass();
    await this.otp.fill(user.otp);
  }
}