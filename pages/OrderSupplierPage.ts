import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class OrderSupplierPage extends BasePage {

    readonly SUPPLIER_NAME_COMBOBOX: Locator;
    readonly ORDER_SUPPLIER_BUTTON: Locator;
    readonly CREATE_PURCHASE_ORDER_BUTTON: Locator;


    constructor(page: Page) {
        super(page);
        this.ORDER_SUPPLIER_BUTTON = page.getByRole('button', { name: 'Đặt hàng nhập' });
        this.SUPPLIER_NAME_COMBOBOX = page.getByRole('combobox', { name: 'Nhà cung cấp※' });
        this.CREATE_PURCHASE_ORDER_BUTTON = page.getByRole('button', { name: 'Tạo Phiếu Nhập' });

    }

    async gotoOrderSupplierPage() {
        await this.page.goto(Config.urlStaging + '/order-supplier');
    }

    async clickCreatePurchaseOrderButton() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page', { timeout: 15000 }),
            this.safeClick(this.CREATE_PURCHASE_ORDER_BUTTON)
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        await newPage.bringToFront();
        return newPage;
    }

    async clickOrderSupplierButton() {
        await this.safeClick(this.ORDER_SUPPLIER_BUTTON);
    }

    async fillSupplierName(name: string) {
        await this.safeFill(this.SUPPLIER_NAME_COMBOBOX, name);
        const option = this.page.getByRole('option', { name });
        await this.safeClick(option, { nth: 0 });
    }
}
