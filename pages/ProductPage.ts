import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {

    readonly PRODUCT_NAME: Locator;
    readonly PRODUCT_CODE: Locator
    readonly CAPITAL_PRICE: Locator;
    readonly RETAIL_PRICE: Locator;
    readonly UNIT_DROPDOWN: Locator;
    readonly UNIT_INPUT: Locator;
    readonly SEARCH_PRODUCT_INPUT: Locator;

    constructor(page: Page) {
        super(page);
        this.PRODUCT_NAME = page.getByLabel('Tên sản phẩm※', { exact: true });
        this.PRODUCT_CODE = page.getByLabel('Mã', { exact: true });
        this.CAPITAL_PRICE = page.getByRole('textbox', { name: 'Giá vốn※' });
        this.RETAIL_PRICE = page.getByRole('textbox', { name: 'Giá bán※' });
        this.UNIT_DROPDOWN = page.getByRole('combobox').filter({ hasText: 'Đơn vị※(blanks)' }).locator('i');
        this.UNIT_INPUT = page.getByRole('combobox', { name: 'Đơn vị※' });
        this.SEARCH_PRODUCT_INPUT = page.getByRole('textbox', { name: 'Mã, tên sản phẩm' });
    }

    async gotoProductPage() {
        await this.page.goto(Config.urlStaging + '/product');
    }

    async verifyInventoryQuantity(expectedQuantity: string) {
        await expect(
            this.page
                .locator('#row-0')
                .getByText(expectedQuantity, { exact: true })
        ).toBeVisible();
    }
    async fillSearchProductInput(text: string) {
        await this.safeFill(this.SEARCH_PRODUCT_INPUT, text);
    }

    async selectUnit(unit: string) {
        await this.safeClick(this.UNIT_DROPDOWN);
        await this.safeFill(this.UNIT_INPUT, unit);
        const option = this.page.getByRole('option', { name: unit });
        await option.click();
    }

    async fillCapitalPrice(price: string) {
        await this.safeFill(this.CAPITAL_PRICE, price);
    }

    async fillRetailPrice(price: string) {
        await this.safeFill(this.RETAIL_PRICE, price);
    }

    async fillProductName(name: string) {
        await this.safeFill(this.PRODUCT_NAME, name);
    }

    async fillProductCode(code: string) {
        await this.safeFill(this.PRODUCT_CODE, code);
    }
}
