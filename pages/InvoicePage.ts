import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InvoicePage extends BasePage {

    readonly INVOICE_PAGE: Locator;


    constructor(page: Page) {
        super(page);
        this.INVOICE_PAGE = page.getByText('Hóa đơn', { exact: true });

    }

    async clickInvoicePage() {
        await this.safeClick(this.INVOICE_PAGE)
    }

    // async createInvoice(searchGoods: string, handler: string) {
    //     await this.clickInvoicePage();
    //     await this.();
    //     await this.fillSearchGoods(searchGoods);
    //     await this.fillHandler(handler);
    // }
}
