import { test } from '../../fixtures/microsoft-365';
import config from '../../powerapps.config';

test('Login as the Asset Admin', async ({ microsoft365 }) => {

    const { tenant, users: { "Asset Admin": user } } = config;
    
    await microsoft365.login(tenant, user);
    
});

test('Login as the Asset Manager', async ({ microsoft365 }) => {
    
    const { tenant, users: { "Asset Manager": user } } = config;

    await microsoft365.login(tenant, user);

});