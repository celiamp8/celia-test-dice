import { Page, Locator, expect } from "@playwright/test";

export default class MIOEventCreationPage {
  readonly page: Page;
  readonly eventName: Locator;
  readonly eventGenre: Locator;
  readonly eventVenue: Locator;
  readonly timelineSection: Locator;
  readonly eventAnnouncementDate: Locator;
  readonly eventOnSaleDate: Locator;
  readonly eventOffSaleDate: Locator;
  readonly eventStartDate: Locator;
  // No need to set the end date for this test- potential improvement: add the field and configure its input
  readonly todayDateBtn: Locator;
  readonly eventDescription: Locator;
  readonly saveEventBtn: Locator;
  readonly submitEventBtn: Locator;
  readonly addFirstTicketBtn: Locator;
  readonly addNextTicketBtn: Locator;

  // Elements belonging to the add ticket modal:
  readonly addTicketModal: Locator;
  readonly ticketName: Locator;
  readonly ticketPrice: Locator;
  readonly saveTicketBtn: Locator;

  // Fields from the event details confirmation modal:
  readonly eventConfirmationtModal: Locator;
  readonly eventNameConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    // Event Creation Form
    this.eventName = this.page.getByPlaceholder('Name of the event or headline artist');
    this.eventGenre = this.page.getByText('Search for a genre');
    this.eventVenue = this.page.locator('#primaryVenue');
    this.todayDateBtn = this.page.getByRole('button', { name: 'Today' });
    this.timelineSection = this.page.getByText('TimelineSet the timing of your event, when it\’s on sale, and the running order.T');
    this.eventAnnouncementDate = this.page.locator('input[name="announceDate"]');
    this.eventOnSaleDate = this.page.locator('input[name="onSaleDate"]');
    this.eventOffSaleDate = this.page.locator('input[name="offSaleDate"]');
    this.eventStartDate = this.page.locator('input[name="date"]');
    this.eventDescription = this.page.getByLabel('rdw-editor');
    this.saveEventBtn = this.page.getByRole('button', { name: 'Save and continue' });
    this.submitEventBtn = this.page.getByRole('button', { name: 'Submit' });
    this.addFirstTicketBtn = this.page.locator('text=Add a ticket');
    this.addNextTicketBtn = this.page.getByText('Add a ticket type');

    // Add Ticket Modal
    this.addTicketModal = this.page.getByTestId('modal');
    this.ticketName = this.addTicketModal.locator('input[name="name"]');
    this.ticketPrice = this.addTicketModal.getByPlaceholder('0.00');
    this.saveTicketBtn = this.addTicketModal.getByRole('button', { name: 'Save' });

    // Event Confirmation Modal
    this.eventConfirmationtModal = this.page.getByTestId('modal');
    this.eventNameConfirmation = this.eventConfirmationtModal.locator('dd[data-id="basics.name"]');

  }

  // TODO Improvement - create Event type with constrained data
  async populateEventDetails(event: any) {
    await this.eventName.fill(event.name);
    await this.selectEventGenre(event.genre);
    await this.selectEventVenue(event.venueSearchText, event.venue);
    await this.selectDate(this.eventAnnouncementDate, event.announceDate);
    await this.selectDate(this.eventOnSaleDate, event.onSaleDate);
    await this.selectDate(this.eventOffSaleDate, event.offSaleDate);
    await this.selectDate(this.eventStartDate, event.startDate);
    // End date is automatically populated --can change this in the future if needed
    // BELOW - hardcoding the image input for this test - open to improvement
    await this.page.setInputFiles('input[accept="image/jpeg"]', '800x800.jpg');
    await this.eventDescription.fill(event.description);
  }

  async selectEventGenre(genre: string) {
    await this.eventGenre.click();
    await this.page.getByText(genre, { exact: true }).click();
  }
  async selectEventVenue(searchText: string, venue: string) {
    await this.page.getByText('Search for a venue').click();
    await this.eventVenue.fill(searchText);
    await this.page.getByText(venue, { exact: true }).click();

  }
  async selectDate(dateLocator: Locator, date: string) {
    await dateLocator.click();
    // If the date is different from today, we select it with the given format 'Choose Day, DD MMMM YYYY'
    if (date == 'TODAY') {
      await this.todayDateBtn.click();
    } else {
      await this.page.getByLabel('Choose ' + date).click();
    }
    // Click outside of the date selection modal
    await this.timelineSection.click();
  }

  async addTicket(index: number, ticket: any) {
    if (index == 0) {
      await this.addFirstTicketBtn.click();
    } else {
      await this.addNextTicketBtn.click();
    }

    await this.selectTicketType(ticket.type);
    await this.ticketName.fill('');
    await this.ticketName.fill(ticket.name);
    await this.ticketPrice.fill(ticket.price);

    await this.saveTicketBtn.click();
  }
  async selectTicketType(ticketType: string) {
    await this.addTicketModal.locator('button[data-id="iconButton[' + ticketType + ']"]').click();
  }

  async saveEvent() {
    await this.saveEventBtn.click();
  }
  async submitEvent() {
    await this.submitEventBtn.click();
  }

  async validateEventData(event: any) {
    await expect(this.eventNameConfirmation).toContainText(event.name);
  }
}