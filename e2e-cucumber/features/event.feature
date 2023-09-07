Feature: Test the creation and booking of an event
  As a MIO user
  I want to be able to create an event
  As a Fan user
  I want to be able to book a ticket for the new event

  Scenario: A Fan user can purchase a ticket for an event created by a MIO user
    Given I create the "eventWith2TicketTypes" event as a MIO user
    When I purchase a "VIP" ticket of the "eventWith2TicketTypes" event as a Fan user
    Then the purchase confirmation for the "VIP" ticket of the "eventWith2TicketTypes" event should be displayed