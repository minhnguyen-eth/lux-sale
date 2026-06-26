import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class ReturnProductPage extends BasePage {

    constructor(page: Page) {
        super(page);

    }

    async gotoReturnProductage() {
        await this.page.goto(Config.urlStaging + '/return-product');
    }


    async verifyReturnProduct(expected: string, nth: number = 0) {
        const returnProductCell = this.page
            .locator('td')
            .filter({ hasText: expected })
            .nth(nth);

        await expect(returnProductCell).toBeVisible();
    }

}
