describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
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

  it('should login with valid credentials', () => {
    // Navigate to login
    cy.get('[data-testid="menu-button"]').click()
    cy.get('[data-testid="login-menu-item"]').click()

    // Login process
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()

    // After successful login, menu should show user is logged in
    cy.get('[data-testid="menu-button"]').click()
    cy.get('[data-testid="user-email"]').should('contain', 'test@example.com')
  })

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="error-message"]').should('be.visible')
  })
}) 