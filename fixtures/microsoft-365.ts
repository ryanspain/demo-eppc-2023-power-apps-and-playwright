import { test as baseTest, Page } from '@playwright/test';
import { Tenant, User } from '../powerapps.config';

class Microsoft365Session {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async login(tenant: Tenant, user: User) {

        // Try restore the authentication state
        let authState: any;
        
        try {
            authState = await import(`../${user.storageStatePath}`);
            console.warn(`Found existing authentication state for ${user.email}. Reusing state...`);
        } catch (error) {
            console.warn(`Existing authentication state not found for ${user.email}. Signing in...`);
        }

        if (authState)
        {
            const cookies = authState.cookies;
            await this.page.context().addCookies(cookies);
        }

        // Open the sign in URL
        await this.page.goto(tenant.signInUrl);

        // Exit if already signed in
        if (await this.page.url().includes(tenant.signedInUrl)) {
            return;
        }

        // Input user email
        await this.page.locator('input[name="loginfmt"]').click();
        await this.page.locator('input[name="loginfmt"]').fill(user.email);
        await this.page.getByRole('button', { name: 'Next' }).click();

        // Input user password
        await this.page.locator('input[name="passwd"]').click();
        await this.page.locator('input[name="passwd"]').fill(user.password);
        await this.page.getByRole('button', { name: 'Sign in' }).click();

        // Wait for successful sign in
        await this.page.waitForURL(url => url.href.includes(tenant.signedInUrl));

        // Save the authentication state
        await this.page.context().storageState({ path: user.storageStatePath });
        // await this.page.context().close();
    }
}

type Microsoft365Fixtures = {
    microsoft365: Microsoft365Session;
};

export * from '@playwright/test';
export const test = baseTest.extend<Microsoft365Fixtures>({
    microsoft365: async ({ browser }, use) => {
        // Create a new browser context
        const context = await browser.newContext();
        const page = await context.newPage();

        // Create a new session for the user
        const session = new Microsoft365Session(page);

        // Use the session
        await use(session);
        await context.close();
    }
});
