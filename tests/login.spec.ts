import { test, } from './base-test';
import { LoginPage } from '../pages/LoginPage';
import Config from '../utils/configUtils';
import { allure } from 'allure-playwright';

test.describe.serial('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {

    allure.feature('Login Feature');
    allure.owner('Minh Nguyen');
    allure.severity('Critical');

    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login Successful With Valid Credentials', async () => {
    allure.story('Valid Admin Login Story');

    await allure.step('Login with admin account', async () => {
      await loginPage.login(Config.admin_username, Config.admin_password);
    });

    await allure.step('Verify successful admin login', async () => {
      await loginPage.expectLoginSuccess('STG');
    });
  });

});
