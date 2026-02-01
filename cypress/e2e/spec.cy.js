// filter type buttons
describe('click filter buttons', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.get('#movie_btn').click();
    cy.wait(2500);
  })
  
  it('clicks series_btn', () => {
    cy.visit('http://localhost:5173/');
    cy.get('#series_btn').click();
    cy.wait(2500);
  })
  
  it('clicks series_btn', () => {
    cy.visit('http://localhost:5173/');
    cy.get('#all_btn').click();
  })
})

// favorites buttons
describe('click favorites buttons', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.get('#card').click();
    cy.wait(2500);
    cy.get('#save_btn').click();
    cy.wait(2500);
    cy.get('#close_btn').click();
    cy.wait(2500);
    cy.get('#favorites_btn').click();
  })
})