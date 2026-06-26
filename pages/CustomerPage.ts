import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class CustomerPage extends BasePage {

    readonly CUSTOMER_NAME_INPUT: Locator;
    readonly SEARCH_CUSTOMER_INPUT: Locator;


    constructor(page: Page) {
        super(page);
        this.SEARCH_CUSTOMER_INPUT = page.getByRole('textbox', { name: 'Khách hàng' });
        this.CUSTOMER_NAME_INPUT = page.getByRole('textbox', { name: 'Tên khách hàng※' });
    }

    async gotoCustomerPage() {
        await this.page.goto(Config.urlStaging + '/customer');
    }

    async fillSearchCustomerInput(text: string) {
        await this.safeFill(this.SEARCH_CUSTOMER_INPUT, text);
    }

    async fillCustomerNameInput(text: string) {
        await this.safeFill(this.CUSTOMER_NAME_INPUT, text);
    }

    async verifyCurrentDebtOfCustomer(expectedDebt: string, nth: number) {
        const currentDebtCell = this.page
            .locator('#row-0')
            .getByRole('cell', { name: expectedDebt })
            .nth(nth);

        await expect(currentDebtCell).toBeVisible();
    }
}
