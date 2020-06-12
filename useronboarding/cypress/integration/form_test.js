describe('Form - testing our form inputs', function() {

    this.beforeEach(() => {
        cy.visit("http://localhost:3000/");
    });
    it('add text to inputs and submit form', function() {
        cy.get('[data-cy="submit"]').should('be.disabled');
        cy.get('[data-cy="first_name"]').type("Paulo").should("have.value", "Paulo");
        cy.get('[data-cy="email"]').type("email@email.com").should("have.value", "email@email.com");
        cy.get('[data-cy="password"]').type("P@ulo123").should("have.value", "P@ulo123");
        cy.get('[type="checkbox"]').check().should("be.checked");
        cy.get('[data-cy="submit"]').click();
    })
  })