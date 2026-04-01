Feature: Login & Logout

  Scenario: Verify Login & Logout
    Given I open the login page 
    When I enter <username> as username and <password> as password
    Then I should see dashboard
    And I logout from the application
    Then I should see login page

    Examples:
      | username | password |
      | Admin    | admin123 |
      