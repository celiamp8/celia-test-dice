import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import MIOLoginPage from '../../pages/mio/login.page';
import MIODashboardPage from '../../pages/mio/dashboard.page';
import MIOEventCreationPage from '../../pages/mio/eventcreation.page';
import FanSignInPage from '../../pages/fan/signin.page';
import FanDashboardPage from '../../pages/fan/dashboard.page';
import FanEventPage from '../../pages/fan/event.page';
import FanTicketsPage from '../../pages/fan/tickets.page';

// Global variables used across steps
// Ideally the user data should come from the pipeline based on environment + scenario and
// each event's parameters should be stored in separate json files
const mioUser = {
  email: 'client_admin_auto@dice.fm',
  password: 'musicforever',
};

const fanUser = {
  otp: '0000',
  firstName: 'Celia',
  lastName: 'Tester',
  email: 'celiamp8@protonmail.com',
  birthDate: '01/08/1990',
  cardData: '41111111111111111233444',
  postCode: 'E84RX',
};

// Randomize the value for the Event Name - can be standardised with uuids but this is a lightweight implementation for the exercise
const eventName = 'C Test Event ' + Math.random().toFixed(10).replace('0.', '');

const events: any = {
  eventWith2TicketTypes: {
    name: eventName,
    genre: 'punk',
    venueSearchText: 'DICE London',
    venue: 'DICE VENUE in London',
    announceDate: 'TODAY',
    onSaleDate: 'TODAY',
    offSaleDate: 'Friday, 29 September 2023',
    startDate: 'Saturday, 30 September 2023',
    description: 'A test event for your testing needs.',
    tickets: [
      {
        type: 'standing',
        name: 'General Admission',
        price: '3.000',
      },
      {
        type: 'vip',
        name: 'VIP',
        price: '30.000',
      },
    ],
  },
};

// let response: { json: () => any; status: () => any; };

// Because the sign-in form behaves differently for new/existing mobile numbers,
// this method allows us to use a new one every time and keep the behaviour consistent
const mobileNumber = Math.random().toFixed(10).replace('0.', '');

// MIO Pages
let mioLoginPage: MIOLoginPage;
let mioDashboardPage: MIODashboardPage;
let mioEventCreationPage: MIOEventCreationPage;

// Fan Pages
let fanSignInPage: FanSignInPage;
let fanDashboardPage: FanDashboardPage;
let fanEventPage: FanEventPage;
let fanTicketsPage: FanTicketsPage;

Given('I create the {string} event as a MIO user', async function (eventType) {
  const page = this.page!;

  // Log in as MIO user
  mioLoginPage = new MIOLoginPage(page);
  await mioLoginPage.logIn(mioUser);

  // Click on the button to Create New Event
  mioDashboardPage = new MIODashboardPage(page);
  await mioDashboardPage.openCreateEventPage();

  // Fill in the Event Creation form
  mioEventCreationPage = new MIOEventCreationPage(page);
  await mioEventCreationPage.populateEventDetails(events[eventType]);

  // Create one ticket type for every ticket type in the event
  await Promise.all(
    events[eventType].tickets.map(async (ticket: any) => {
      // Sending the index of every ticket in the data set allows us to switch easily between the 2 'Add Ticket' buttons
      await mioEventCreationPage.addTicket(
        events[eventType].tickets.indexOf(ticket),
        ticket
      );
    })
  );

  // Save Event
  await mioEventCreationPage.saveEvent();

  // Validate Event Confirmation details
  await mioEventCreationPage.validateEventData(events[eventType]);

  // Submit Event
  await mioEventCreationPage.submitEvent();
});

When(
  'I purchase a {string} ticket of the {string} event as a Fan user',
  async function (ticketType, eventType) {
    const page = this.page!;
    fanSignInPage = new FanSignInPage(page);

    // Sign in as a Fan User

    // Uncomment the line below to sign in as a new user, alternatively use the 2nd line to sign in as an existing one
    // await fanSignInPage.signIn(fanUser, mobileNumber);

    await fanSignInPage.signInExistingUser(fanUser);

    // Search for the event to purchase
    fanDashboardPage = new FanDashboardPage(page);
    await fanDashboardPage.findEvent(events[eventType].name);

    // Check that the event page is the correct one
    fanEventPage = new FanEventPage(page);
    await fanEventPage.validateEventName(events[eventType].name);

    // Purchase a ticket of the event
    await fanEventPage.selectTicketToPurchase(ticketType);

    // Enter payment data
    await fanEventPage.enterPaymentData(fanUser);

    // IMPORTANT- When entering the payment data and trying to purchase a ticket, the page didn't change and the console displayed an error (Around 21:00h 6/9/23)
    // I wasn't sure if that's the intended behaviour / a limitation from Stripe
    // However, I could see a confirm_payment response in the network tab, so I implemented the following code as API VALIDATION
    // API VALIDATION:
    const responsePromise = page.waitForResponse(
      (resp: { url: () => string | string[]; status: () => number }) =>
        resp.url().includes('/tickets/confirm_payment') && resp.status() === 200
    );

    // Click on the 'Purchase tickets' button
    await fanEventPage.purchaseTicketsBtn.click();

    // API VALIDATION:
    const response = await responsePromise;
    // BELOW - originally part of the 'Then' step, moved here for immediate validation of purchase
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody.event.name).toBe(events[eventType].name);
    expect(responseBody.event.tickets[0].type.name).toBe(ticketType);
  }
);

Then(
  'the purchase confirmation for the {string} ticket of the {string} event should be displayed',
  async function (ticketType, eventType) {
    const page = this.page!;
    fanTicketsPage = new FanTicketsPage(page);

    // Navigate to the tickets site
    await fanTicketsPage.openTicketsWebsite();

    // Open the ticket page
    await fanTicketsPage.openTicket(events[eventType].name);

    // Check that the ticket has been purchased and is displayed
    await fanTicketsPage.validateTicketInfo(events[eventType], ticketType);
  }
);
