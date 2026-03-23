Feature: Login & Logout

  Scenario: Verify by Valid Login
    Given I open the login page of url "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    When I enter Admin as username and admin123 as password
    Then I should see dashboard of url "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"

  Scenario: Verify Logout
    Given I open the login page of url "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    When I enter Admin as username and admin123 as password
    And I logout from the application
    Then I should see dashboard of url "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"