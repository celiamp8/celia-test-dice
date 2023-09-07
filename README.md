# DICE Senior QA Engineer Technical Task
### Celia Martin
---


## Task Description

1. Create an event in promoter panel - MIO

1.1. Login into MIO as mio user

1.2. Create and submit new event with venue in London
- Event should be on sale
- Event should contain 2 ticket types (e.g. VIP and general)

1.3. Check that the event was created successfully

2. Purchase second ticket type as new fan user in Fan Web app

2.1. Open created event in Fan Web app

2.2. Purchase second ticket type with registration as new fan user
- Phone number can be any valid number
- OTP code for confirming phone: "0000"
3. Check that the correct ticket has been successfully purchased


## Implementation Details

The tests have been implemented with **Playwright, Cucumber and Typescript** following the Page Object Model.

HTML Reports are generated in the project's `reports/` folder.

#### Project Structure
```
.
└── e2e-cucumber/
    ├── features/
    │   └── event.feature
    ├── pages/
    │   ├── mio/
    │   │   └── miopages.page.ts
    │   └── fan/
    │       └── fanpages.page.ts
    └── support/
        └── steps/
            └── event.steps.ts
```
#### Feature Implementation
I have defined the test case as a single `Scenario` as a best practice to prevent scenario 2 dependent on scenario 1 within the same feature.
```gherkin
  Scenario: A Fan user can purchase a ticket for an event created by a MIO user
    Given I create the "eventWith2TicketTypes" event as a MIO user
    When I purchase a "VIP" ticket of the "eventWith2TicketTypes" event as a Fan user
    Then the purchase confirmation for the "VIP" ticket of the "eventWith2TicketTypes" event should be displayed
```

To populate the event creation form fields and later check that the values are displayed, I have defined an object `events` which contains the data for each event, in this case only `eventWith2TicketTypes`. 

For simplicity, I have left the `events` object as a const in the `event.steps.ts` file. However, for an expanded test base it would be best to store it in a separate `events.json` file.

For the purpose of this test I have considered a single Fan and a single MIO users only. This could potentially be sent as a parameter in the feature as well and test the same scenario for multiple users.

## How to Run
**Prerequisites**: Node v18.x installed (18.16.0 used for development)
1. Clone the repository
2. Install dependencies: `npm i`
3. Run tests: `npm run e2e:cucumber`

## Potential Improvements

Due to the nature of the test as a technical task and due to time constraints, the test is quite simplified. Here are some ideas for how it could be improved:
* Encrypt all email-password values and pass them as parameters. Ideally, this could be done in the pipeline to 1. run the same tests in different environments with different values and 2. to avoid having sensitive data (encrypted or not) in the codebase.
* Separate Given/When/Then steps into different files. Not really an issue for this single scenario but would be best to do it for a larger framework.
* Save different event details in json files instead of an object in the steps file.
* Increase the number of data checks, especially for the event details page (after event *Save*, before *Submit*). Currently the tests only check that the name is correct but ideally we should check for all of the values we've input in the event creation form.
* Selectors: A lot of the selectors used are based on the placeholder text. I found during implementation that these worked best for the Playwright framework, and they do serve a double functionality in testing that the placeholder hasn't changed from its expected value. However, I would prefer to use test-data or a similar attribute when possible. 
* Create Types for `Event`, `MIOUser` and `FanUser`. Currently to keep things simple I've left them as `type any` but ideally they should be defined types, especially for a larger framework with higher amounts of data.
* Use the `After` hook to hit the API endpoint to delete any events generated in the test.

## Additional Notes

- When I was creating the tests (06/09/23 evening) I came across the following error after submitting the card details to the Stripe iframe:
![Payment error in console](https://i.imgur.com/bnvc9Mx.png)
![Payment error in console](https://i.imgur.com/9Jppi51.png)

This worked again in the late evening but to circumvent the issue I had implemented the following code:
```typescript
  const responsePromise = page.waitForResponse((resp: { url: () => string | string[]; status: () => number }) => resp.url().includes('/tickets/confirm_payment') && resp.status() === 200);

  await fanEventPage.purchaseTicketsBtn.click();

  const response = await responsePromise;
  const responseBody = await response.json();
  expect(response.status()).toBe(200);
  expect(responseBody.event.name).toBe(events[eventType].name);
  expect(responseBody.event.tickets[0].type.name).toBe(ticketType);
``` 
It waits for the `confirm_payment` response generated after we click the `Purchase Tickets` button and checks that the payment request has been successful for the event of a given name.

I left the code in as part of the `When` step, since it was already done and provides an extra layer of safety in minimal time.
