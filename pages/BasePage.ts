import { Page, Locator, expect } from "@playwright/test";
import { SafeActions } from "./SafeActions";

export class BasePage extends SafeActions {

    // Buttons 
    readonly INSERT_BUTTON: Locator;
    readonly SAVE_BUTTON: Locator;
    readonly DONE_BUTTON: Locator;
    readonly AGREE_BUTTON: Locator;
    readonly NO_BUTTON: Locator


    // Inputs / Textareas
    readonly HANDLER: Locator;
    readonly NOTE: Locator;
    readonly QUANTITY_INPUT: Locator;
    readonly SEARCH_INPUT: Locator;

    // Status Indicators / Labels


    // Dropdowns & Comboboxes
    readonly PRODUCT_NAME_COMBOBOX: Locator;


    // Others
    readonly ROW_1: Locator;


    constructor(page: Page) {
        super(page);
        this.SEARCH_INPUT = page.getByRole('textbox', { name: 'Tìm kiếm' });
        this.DONE_BUTTON = page.getByRole('button', { name: 'Hoàn thành' });
        this.AGREE_BUTTON = page.getByRole('button', { name: 'Đồng ý' });
        this.NO_BUTTON = page.getByRole('button', { name: 'Không' });
        this.ROW_1 = page.getByRole('cell', { name: '1', exact: true });
        this.PRODUCT_NAME_COMBOBOX = page.getByRole('combobox', { name: 'Tên sản phẩm' });
        this.SAVE_BUTTON = page.getByRole('button', { name: 'Lưu' });
        this.INSERT_BUTTON = page.getByRole('button', { name: 'Thêm', exact: true });
        this.HANDLER = page.getByRole('combobox', { name: 'Người xử lý※' });
        this.NOTE = page.getByRole('textbox', { name: 'Ghi chú' });
        this.QUANTITY_INPUT = page.locator(`//tr[td[contains(., '1')]]//td[5]//input[@type='text']`);
    }

    /* Menu Cards */
    getMenuCard(name: string) {
        return this.page.getByRole('heading', { name });
    }

    async clickMenuCard(name: string) {
        await this.getMenuCard(name).click();
    }
    /* Menu Cards */


    async fillSearchInput(text: string) {
        await this.safeFill(this.SEARCH_INPUT, text);
    }

    async fillQuantity(quantity: string) {
        await this.safeFill(this.QUANTITY_INPUT, quantity);
    }

    async clickDoneButton() {
        await this.safeClick(this.DONE_BUTTON);
    }

    async clickAgreeButton() {
        await this.safeClick(this.AGREE_BUTTON);
    }

    async clickNoButton() {
        await this.safeClick(this.NO_BUTTON);
    }

    async fillProductNameCombobox(productName: string) {
        await this.safeFill(this.PRODUCT_NAME_COMBOBOX, productName);
        const option = this.page.getByRole('option', { name: productName });
        await option.click();
    }

    async clickFirstRow() {
        await this.safeClick(this.ROW_1);
    }

    async clickSaveButton() {
        await this.safeClick(this.SAVE_BUTTON);
    }

    async clickInsertButton() {
        await this.safeClick(this.INSERT_BUTTON);
    }

    async fillHandler(text: string) {
        await this.safeFill(this.HANDLER, text);
        const option = this.page.getByRole('option', { name: text });
        await this.safeClick(option, { nth: 0 });
    }

    async fillNote(text: string) {
        await this.safeFill(this.NOTE, text);
    }
}
