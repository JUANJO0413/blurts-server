const { test, expect } = require('@playwright/test');
const { BreachPage } = require('../pages/breachPage');
const { LandingPage } = require('../pages/landingPage');
const { SecurityPage } = require('../pages/securityTipsPage');
const { defaultScreenshotOpts } = require('../utils/helpers');

test.describe.only('Monitor Landing Page', () => {
  let landingPage;
  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.open();
  });

  test('Verify Monitor landing page elements exist in DOM', async ({
    page
  }) => {
    await expect(page).toHaveTitle(/Firefox Monitor/);
    await expect(page.locator('#scan-user-email')).toBeVisible();
    await expect(page.locator('.latest-breach-info')).toBeVisible();
  });

  test('Verify breaches page', async ({ page }) => {
    await landingPage.goToBreaches();

    const breachPage = new BreachPage(page);
    expect(await breachPage.breachCardsIndividual.count()).toEqual(15);
    await expect(breachPage.showAllbreachesButton).toBeVisible();
  });

  test('Verify breach check on landing page', async ({ page }) => {
    const testEmail = Date.now() + '_testacct2@restmail.net';
    await page.fill(landingPage.checkForBreachesEmailInput, testEmail);
    await landingPage.checkForBreachesButton.click();

    await expect.poll(async () => {
      return page.url()
    }, {
      intervals: [1_000]
    }).toContain('/scan');
    expect(await landingPage.emailScannedForBreaches.textContent()).toContain(
      testEmail
    );
    expect(await landingPage.breachResults.textContent()).toContain('This email appeared in 0 known data breaches');
  });  
});

test.describe.only('Monitor Landing Page - Visual Regression', () => {
  test.skip(({ browserName }) => browserName !== 'webkit', 'Webkit only image comparisons!');

  let landingPage;
  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.open();
  });

  test('Verify Landing visually', async () => {
    await expect(landingPage.header).toHaveScreenshot('header.png', defaultScreenshotOpts);

    await expect(landingPage.personalDataBanner).toHaveScreenshot('personalDataBanner.png', defaultScreenshotOpts);

    await expect(landingPage.monitorLanding).toHaveScreenshot('monitorLanding.png', defaultScreenshotOpts);
  });

  test('Verify breaches page', async ({ page }) => {
    await landingPage.goToBreaches();

    const breachPage = new BreachPage(page);
    await expect(breachPage.breachPageTitleBanner).toHaveScreenshot(
      'breachPageTitleBanner.png', defaultScreenshotOpts
    );

    await expect(breachPage.breachPageSearchSection).toHaveScreenshot(
      'breachPageSearchSection.png',
      {...defaultScreenshotOpts, mask: [breachPage.breachCards, breachPage.vpnBanner]}
    );
  });

  test('Verify security tips page', async ({ page }) => {
    await landingPage.goToSecurityTips();
    const securityPage = new SecurityPage(page);

    await expect(securityPage.securityPageUI).toHaveScreenshot(
      'SecurityPageUI.png',
      {...defaultScreenshotOpts, mask: [securityPage.vpnBanner]}
    );
  });  
});
