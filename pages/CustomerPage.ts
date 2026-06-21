import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class CustomerPage extends BasePage {


    constructor(page: Page) {
        super(page);
    }

    async gotoCustomerPage() {
        await this.page.goto(Config.urlStaging + '/customer');
    }
}
