import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the correct title', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle('Tailspin Toys - Crowdfunding your new favorite game!');
  });

  test('should display the main heading', async ({ page }) => {
    // Check that the main page heading is present
    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Toys', exact: true })).toBeVisible();
  });

  test('should display the site branding in header', async ({ page }) => {
    // Check that the site branding is present in the header (no longer an h1)
    await expect(page.getByText('Tailspin Toys').first()).toBeVisible();
  });

  test('should display the welcome message', async ({ page }) => {
    // Check that the welcome message is present using more specific locator
    await expect(page.getByText('Find your next game! And maybe even back one! Explore our collection!')).toBeVisible();
  });

  test('should filter games by category and publisher together', async ({ page }) => {
    await test.step('Select a category and publisher filter', async () => {
      await page.getByRole('checkbox', { name: 'Strategy' }).check();
      await page.getByLabel('Publisher').selectOption({ label: 'CodeForge Studios' });
      await page.getByTestId('apply-filters-button').click();
    });

    await test.step('Verify the filtered catalog matches the chosen combination', async () => {
      const cards = page.locator('[data-testid="game-card"]:not([hidden])');
      await expect(cards).toHaveCount(1);
      await expect(cards.getByTestId('game-title')).toHaveText('DevOps Dominion');
      await expect(page.getByTestId('filter-results-summary')).toContainText('1 game matches your filters');
    });
  });
});
