import * as AppConfig from "../fixtures/appConfig.local.json"


function CheckLoginStateAndLogoutIfNeed()
{
  cy.visit(AppConfig.AppFrontUrl);
    // verifier que on repart bien deconnecté
    cy.location('pathname').should('eq', '/home-map')

    cy.wait(1000);

    cy.get("body").then(($body) => {
      // Vérifie si le bouton d'acceptation des cookies est présent
      if ($body.find('[data-testid="exit-menu-item"]').length > 0) {
        cy.getByTestId('exit-menu-item').click(); // Clique sur le bouton si présent
        cy.getByTestId('popup-yes-button').click();
      } else {
        cy.log("Check start not logged OK !");
      }
    });
}

// Tester le mecanisme d'authentification seul
describe('Authentication Flow', () => {

  before(() => {
    CheckLoginStateAndLogoutIfNeed();
  });

  beforeEach(() => {
    cy.visit(AppConfig.AppFrontUrl);
  })

  it('should navigate to login page from menu', () => {
    // Open menu and click login button
    cy.get('[data-testid="menu-button"]').click()
    cy.get('[data-testid="login-menu-item"]').click()
    cy.url().should('include', '/log-in')
  })

  it('should display login form when on login page', () => {
    // Navigate to login page first
    cy.get('[data-testid="menu-button"]').click()
    cy.get('[data-testid="login-menu-item"]').click()

    // Check login form elements
    cy.get('[data-testid="login-form"]').should('exist')
    cy.get('[data-testid="email-input"]').should('exist')
    cy.get('[data-testid="password-input"]').should('exist')
    cy.get('[data-testid="login-button"]').should('exist')
  })


  it('should show error with invalid credentials', () => {

    // Navigate to login page first
    cy.get('[data-testid="menu-button"]').click()
    cy.get('[data-testid="login-menu-item"]').click()

    // Test no user 
    cy.get('[data-testid="login-button"]').click()

    // Verify required message
    cy.getByTestId("email-form-input").should('contain', 'Email est requis')
    cy.getByTestId("password-form-input").should('contain', 'Le mot de passe est requis')

    // Todo other message 


    // Test Wrong user
    cy.get('[data-testid="email-input"]').type('invalid@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()


    cy.get('[data-testid="popup-message"]').should('contain', "L'email et/ou le mot de passe est incorrect.")
  })

  it('should login with valid credentials', () => {
    // Navigate to login
    cy.get('[data-testid="menu-button"]').click()
    cy.get('[data-testid="login-menu-item"]').click()

    // Login process
    cy.get('[data-testid="email-input"]').type(AppConfig.Users.Kevin.Login)
    cy.get('[data-testid="password-input"]').type(AppConfig.Users.Kevin.Mdp)
    cy.get('[data-testid="login-button"]').click()

    // After successful login, menu should show user is logged in
    cy.getByTestId('exit-menu-item').should('contain', 'Quitter')
  })
}) 