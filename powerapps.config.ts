const config: PowerAppsConfig = {
    tenant: {
        signInUrl: "https://login.microsoftonline.com/",
        signedInUrl: "https://www.office.com/",
    },
    apps: {
        "Asset Checkout": {
            url: process.env.ASSET_CHECKOUT_APP_URL!,
            displayName: "Asset Checkout"
        }
    },
    users: {
        "Asset Admin": {
            email: process.env.ASSET_ADMIN_EMAIL!,
            password: process.env.ASSET_ADMIN_PASSWORD!,
            storageStatePath: 'playwright/.auth/asset-admin.json'
        },
        "Asset Manager": {
            email: process.env.ASSET_MANAGER_EMAIL!,
            password: process.env.ASSET_MANAGER_PASSWORD!,
            storageStatePath: 'playwright/.auth/asset-manager.json'
        }
    }
};

export interface PowerAppsConfig {
    tenant: Tenant;
    apps: PowerAppsCollection;
    users: UsersCollection;
}

export interface Tenant {
    signInUrl: string;
    signedInUrl: string;
}

export interface PowerAppsCollection {
    [key: string]: PowerApp;
}

export interface PowerApp {
    displayName: string;
    url: string;
}

export interface UsersCollection {
    [key: string]: User;
}

export interface User {
    email: string;
    password: string;
    storageStatePath: string;
}

export default config;