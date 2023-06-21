import { test as baseTest, expect, Page, Locator } from '@playwright/test';
import config, { PowerApp, User } from '../powerapps.config';

class PowerAppSession {
    page: Page;
    app: PowerApp;

    constructor(page: Page, app: PowerApp) {
        this.page = page;
        this.app = app;
    }

    async openApp() {
        await this.page.goto(this.app.url);
        await this.page.waitForURL(this.app.url);
        await expect(this.page.getByText(this.app.displayName).first()).toBeVisible();
    }
}

class AssetAdminSession extends PowerAppSession {
    async createLaptopReservation(reservationName: string, startDate: string, daysDuration: number) {
        await this.page.getByRole('treeitem', { name: 'Reservations' }).locator('div').nth(3).click();
        await this.page.getByRole('menuitem', { name: 'New', exact: true }).click();
        await this.page.getByLabel('Name').click();
        await this.page.getByLabel('Name').fill(reservationName);
        await this.page.getByRole('combobox', { name: 'Product Reservation, Lookup' }).click();
        await this.page.getByPlaceholder('Look for Product Reservation').fill('');
        await this.page.getByPlaceholder('Look for Product Reservation').click();
        await this.page.getByPlaceholder('Look for Product Reservation').fill('laptop');
        await this.page.getByRole('treeitem', { name: 'Laptop, 5/13/2023 12:37 AM' }).click();
        await this.page.getByLabel('Date of Reservation Start').click();
        await this.page.getByLabel('Date of Reservation Start').fill(startDate);
        await this.page.getByLabel('Reserve for (days)').click();
        await this.page.getByLabel('Reserve for (days)').fill(daysDuration.toString());
        await this.page.getByRole('menuitem', { name: 'Save (CTRL+S)' }).click();
    }

    async setReservationReadyToCollect(reservationName: string) {
        await this.page.getByRole('treeitem', { name: 'Reservations' }).click();
        await this.page.getByRole('button', { name: 'All Reservations' }).click();
        await this.page.getByText('Approved Reservations', { exact: true }).click();
        await this.page.getByRole('link', { name: reservationName }).first().click();
        await this.page.getByRole('button', { name: 'Status Reason' }).first().click();
        await this.page.getByRole('option', { name: 'Ready for collection' }).click();
        await this.page.getByRole('menuitem', { name: 'Save (CTRL+S)' }).click();
    }

    async setReservationCollected(reservationName: string) {
        await this.page.getByRole('treeitem', { name: 'Reservations' }).click();
        await this.page.getByRole('link', { name: reservationName }).first().click();
        await this.page.getByRole('button', { name: 'Status Reason' }).first().click();
        await this.page.getByRole('option', { name: 'Collected' }).click();
        await this.page.getByRole('menuitem', { name: 'Save (CTRL+S)' }).click();
    }
}

class AssetManagerSession extends PowerAppSession {
    async approveReservation(reservationName: string) {
        await this.page.getByRole('treeitem', { name: 'Reservations' }).click();
        await this.page.getByRole('button', { name: 'All Reservations' }).click();
        await this.page.getByText('Reservations Pending Approval', { exact: true }).click();
        await this.page.getByRole('link', { name: reservationName }).first().click();
        await this.page.getByRole('button', { name: 'Status Reason' }).first().click();
        await this.page.getByRole('option', { name: 'Approved' }).click();
        await this.page.getByRole('menuitem', { name: 'Save (CTRL+S)' }).click();
    }
}

type PowerAppFixtures = {
    assetAdmin: AssetAdminSession;
    assetManager: AssetManagerSession;
};

export * from '@playwright/test';
export const test = baseTest.extend<PowerAppFixtures>({
    assetAdmin: async ({ browser }, use) => {
        // Get the app and user from the config
        const app = config.apps["Asset Checkout"];
        const user = config.users["Asset Admin"];
        
        // Create a new browser context with the storage state populated
        const context = await browser.newContext({ storageState: user.storageStatePath });
        const page = await context.newPage();

        // Create a new session for the user
        const session = new AssetAdminSession(page, app);

        // Use the session
        await use(session);
        await context.close();
    },
    assetManager: async ({ browser }, use) => {
        // Get the app and user from the config
        const app = config.apps["Asset Checkout"];
        const user = config.users["Asset Manager"];

        // Create a new browser context with the storage state populated
        const context = await browser.newContext({ storageState: user.storageStatePath });
        const page = await context.newPage();

        // Create a new session for the user
        const session = new AssetManagerSession(page, app);

        // Use the session
        await use(session);
        await context.close();
    },
});
