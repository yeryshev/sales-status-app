import { selectByTestId } from '../../helpers/selectByTestId';

describe('routing', () => {
  describe('user is not authenticated', () => {
    it('visit main page', () => {
      cy.visit('/');
      cy.get(selectByTestId('login-page')).should('exist');
    });
  });
  it('not found page', () => {
    cy.visit('/unknown-page');
    cy.get(selectByTestId('not-found-page')).should('exist');
  });
});
