import { test, } from './base-test';
import { LoginPage } from '../pages/LoginPage';
import Config from '../utils/configUtils';
import { allure } from 'allure-playwright';
import { ProductPage } from '../pages/ProductPage';

test.describe.serial('Login Tests', () => {
    let loginPage: LoginPage;
    let productPage: ProductPage

    test.beforeEach(async ({ page }) => {

        allure.feature('ProductPage Feature');
        allure.owner('Minh Nguyen');
        allure.severity('Critical');

        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        await loginPage.goto();
    });

    // Thêm SP loại SP thành công với đầy đủ thông tin 


});
