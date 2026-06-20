import { test, } from './base-test';
import { LoginPage } from '../pages/LoginPage';
import Config from '../utils/configUtils';
import { allure } from 'allure-playwright';
import { InvoicePage } from '../pages/InvoicePage';

test.describe.serial('Login Tests', () => {
    let loginPage: LoginPage;
    let invoicePage: InvoicePage

    test.beforeEach(async ({ page }) => {

        allure.feature('Invoice Feature');
        allure.owner('Minh Nguyen');
        allure.severity('Critical');

        loginPage = new LoginPage(page);
        invoicePage = new InvoicePage(page);
        await loginPage.goto();
    });

    // test('Create a invoice successfully', async () => {
    //     allure.story('Create a invoice successfully');

    //     await allure.step('Login with admin account', async () => {
    //         await loginPage.login(Config.admin_username, Config.admin_password);
    //     });

    //     await allure.step('Create a invoice', async () => {
    //         await invoicePage.createInvoice();
    //     });
    // });
});
