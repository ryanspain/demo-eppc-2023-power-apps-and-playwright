import { test, expect } from '../../fixtures/power-app';

test('app opens', async ({ assetAdmin }) => {

    await assetAdmin.openApp();

    const title = assetAdmin.page.getByText("Asset Checkout").first();

    await expect(title).toBeVisible();
});

test('app site map correct', async ({ assetAdmin }) => {

    await assetAdmin.openApp();

    const siteMap = await assetAdmin.page.getByRole('tree', { name: 'Navigate Dynamics 365' });

    // site map groups
    await expect(siteMap.getByRole('heading', { name: 'Asset Checkout' })).toBeVisible();

    // site map sub areas
    await expect(siteMap.getByRole('treeitem', { name: 'Products' })).toBeVisible();
    await expect(siteMap.getByRole('treeitem', { name: 'Reservations' })).toBeVisible();
    await expect(siteMap.getByRole('treeitem', { name: 'Reviews' })).toBeVisible();
});

test('create and approve reservation', async ({ assetAdmin, assetManager }) => {

    test.slow();

    // asset manager - create reservation
    await assetAdmin.openApp();
    await assetAdmin.createLaptopReservation('EPPC demo reservation', '09/22/2023', 3);

    // asset manager - approve reservation
    await assetManager.openApp();
    await assetManager.approveReservation('EPPC demo reservation');

    // asset admin - set reservation as ready to collect
    await assetAdmin.openApp();
    await assetAdmin.setReservationReadyToCollect('EPPC demo reservation');

    // asset admin - set reservation as collected
    await assetAdmin.openApp();
    await assetAdmin.setReservationCollected('EPPC demo reservation');

});