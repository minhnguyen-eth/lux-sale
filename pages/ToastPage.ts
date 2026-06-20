import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ToastPage extends BasePage{
    readonly toastSuccess: Locator;
    readonly toastFailed: Locator;

    constructor(page: Page) {
        super(page);
        this.toastSuccess = page.locator('//div[contains(text(),"Thành công")]');
        this.toastFailed = page.locator('//div[contains(text(),"Thất bại")]')
    }

    async getToastSuccess() {
        await this.safeVerifyToHaveText(this.toastSuccess, 'Thành công');
    }

    async getToastFailed() {
        await this.safeVerifyToHaveText(this.toastFailed, 'Thất bại');
    }
}
