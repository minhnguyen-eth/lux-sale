import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class SupplierPage extends BasePage {

    readonly SUPPLIER_NAME: Locator;
    readonly SUPPLIER_LINK: Locator;

    constructor(page: Page) {
        super(page);
        this.SUPPLIER_NAME = page.getByRole('textbox', { name: 'Tên nhà cung cấp※' });
        this.SUPPLIER_LINK = page.getByRole('link', { name: 'Nhà cung cấp', exact: true });

    }

    async gotoSupplierPage() {
        await this.page.goto(Config.urlStaging + '/supplier');
    }

    async fillSupplierName(name: string) {
        await this.safeFill(this.SUPPLIER_NAME, name);
    }

    async clickSupplierLink() {
        await this.safeClick(this.SUPPLIER_LINK);
    }

    async verifyCurrentDebt(expectedDebt: string) {
        const currentDebtCell = this.page
            .locator('#row-0')
            .getByRole('cell')
            .nth(6);

        await this.safeVerifyToHaveText(currentDebtCell, expectedDebt);
    }
}
