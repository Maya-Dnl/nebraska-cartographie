describe('Building Form', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the building form', () => {
    cy.get('form').should('exist')
  })

  it('should validate required fields', () => {
    // Find submit button and click it without filling the form
    cy.get('button[type="submit"]').click()

    // Check for validation messages
    cy.get('.error-message').should('be.visible')
  })

  it('should successfully submit a valid form', () => {
    // Fill in the form with valid data
    cy.get('input[formControlName="name"]').type('Test Building')
    cy.get('input[formControlName="address"]').type('123 Test Street')
    cy.get('input[formControlName="city"]').type('Test City')
    cy.get('input[formControlName="postalCode"]').type('12345')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Verify successful submission (adjust based on your actual success indicator)
    cy.get('.success-message').should('be.visible')
  })

  it('should handle form updates correctly', () => {
    // Fill form initially
    cy.get('input[formControlName="name"]').type('Initial Name')
    
    // Clear and update
    cy.get('input[formControlName="name"]')
      .clear()
      .type('Updated Name')

    // Verify the update
    cy.get('input[formControlName="name"]')
      .should('have.value', 'Updated Name')
  })

  it('should reset form correctly', () => {
    // Fill in some data
    cy.get('input[formControlName="name"]').type('Test Building')
    cy.get('input[formControlName="address"]').type('123 Test Street')

    // Find and click reset button (adjust selector based on your actual reset button)
    cy.get('button[type="reset"]').click()

    // Verify fields are empty
    cy.get('input[formControlName="name"]').should('have.value', '')
    cy.get('input[formControlName="address"]').should('have.value', '')
  })
}) 