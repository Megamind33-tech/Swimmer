import { expect, test, type Page } from '@playwright/test';

async function goToLobby(page: Page): Promise<void> {
  await page.goto('/?e2e=1');
  await page.getByTestId('splash-play').click();
  await expect(page.getByTestId('home-go-now')).toBeVisible();
}

async function enterRace(page: Page): Promise<void> {
  await goToLobby(page);
  await page.getByTestId('home-go-now').click();
  await expect(page.getByTestId('mode-quick-race')).toBeVisible();
  await page.getByTestId('mode-quick-race').click();
  await expect(page.getByTestId('pre-race-start')).toBeVisible();
  await page.getByTestId('pre-race-start').click();
  await expect(page.getByTestId('prematch-start-now')).toBeVisible();
  await page.getByTestId('prematch-start-now').click();
  await expect(page.getByLabel('Pause race')).toBeVisible();
}

test.describe('critical ship flows', () => {
  test('app load -> lobby usable', async ({ page }) => {
    await goToLobby(page);
    await expect(page.getByTestId('home-go-now')).toBeEnabled();
  });

  test('lobby -> race setup -> countdown/race -> results -> lobby', async ({ page }) => {
    await enterRace(page);
    await expect(page.getByTestId('results-continue')).toBeVisible({ timeout: 20_000 });
    await page.getByTestId('results-continue').click();
    await expect(page.getByTestId('splash-play')).toBeVisible();
  });

  test('pause -> resume', async ({ page }) => {
    await enterRace(page);
    await page.getByLabel('Pause race').click();
    await expect(page.getByText('PAUSED')).toBeVisible();
    await page.getByTestId('pause-resume').click();
    await expect(page.getByText('PAUSED')).toBeHidden();
  });

  test('pause -> exit to lobby', async ({ page }) => {
    await enterRace(page);
    await page.getByLabel('Pause race').click();
    await page.getByTestId('pause-exit').click();
    await expect(page.getByTestId('splash-play')).toBeVisible();
  });

  test('finish -> replay returns to race setup', async ({ page }) => {
    await enterRace(page);
    await expect(page.getByTestId('results-replay')).toBeVisible({ timeout: 20_000 });
    await page.getByTestId('results-replay').click();
    await expect(page.getByTestId('pre-race-start')).toBeVisible();
  });

  test('repeated race entry/exit and overlay open/close stability', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await enterRace(page);
      for (let j = 0; j < 2; j++) {
        await page.getByLabel('Pause race').click();
        await expect(page.getByText('PAUSED')).toBeVisible();
        await page.getByTestId('pause-resume').click();
        await expect(page.getByText('PAUSED')).toBeHidden();
      }
      await page.getByLabel('Pause race').click();
      await page.getByTestId('pause-exit').click();
      await expect(page.getByTestId('splash-play')).toBeVisible();
    }
  });

  test('repeated shell page switching remains usable', async ({ page }) => {
    await goToLobby(page);

    const tabLabels = ['CAREER', 'CLUB', 'TRAIN', 'MARKET', 'RANK', 'STYLE', 'STORE'];
    for (const label of tabLabels) {
      await page.getByRole('button', { name: label }).click();
    }

    await page.getByRole('button', { name: 'Race — go to lobby' }).click();
    await expect(page.getByTestId('home-go-now')).toBeVisible();
  });

  test('orientation/viewport churn keeps race controls reachable', async ({ page }) => {
    await enterRace(page);

    await page.setViewportSize({ width: 412, height: 915 }); // portrait-like
    await page.setViewportSize({ width: 915, height: 412 }); // landscape restore

    await expect(page.getByLabel('Pause race')).toBeVisible();
    await page.getByLabel('Pause race').click();
    await expect(page.getByText('PAUSED')).toBeVisible();
  });
});

