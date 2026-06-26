import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class OrderPage extends BasePage {

    readonly ORDER_BUTTON: Locator;
    readonly ORDER_BUTTON_FORM_PAYMENT: Locator;


    constructor(page: Page) {
        super(page);

        this.ORDER_BUTTON = page.locator('p:has-text("ĐẶT HÀNG")')
        this.ORDER_BUTTON_FORM_PAYMENT = page.getByRole('button', { name: 'Đặt hàng' })
    }

    async gotoOrderPage() {
        await this.page.goto(
            Config.urlStaging + '/order',
            {
                waitUntil: 'networkidle',
                timeout: 60000
            }
        );

        await this.page.waitForLoadState('networkidle');
    }

    async clickOrderButton() {
        await this.safeClick(this.ORDER_BUTTON);
    }

    async clickOrderButtonFormPayment() {
        await this.safeClick(this.ORDER_BUTTON_FORM_PAYMENT);
    }

    async openHandlerPage() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page', { timeout: 15000 }),
            super.clickHandlerButton()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        await newPage.bringToFront();
        return newPage;
    }
}
