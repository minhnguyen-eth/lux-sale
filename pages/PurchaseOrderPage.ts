import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class PurchaseOrderPage extends BasePage {

    readonly SUPPLIER_NAME: Locator;



    constructor(page: Page) {
        super(page);
        this.SUPPLIER_NAME = page.getByRole('textbox', { name: 'Tên nhà cung cấp※' });
        
    }

    async gotoPurchaseOrderPage() {
        await this.page.goto(Config.urlStaging + '/purchase-order');
    }

}
