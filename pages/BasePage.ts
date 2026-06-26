import { Page, Locator, expect } from "@playwright/test";
import { SafeActions } from "./SafeActions";

export class BasePage extends SafeActions {

    // Buttons 
    readonly INSERT_BUTTON: Locator;
    readonly SAVE_BUTTON: Locator;
    readonly DONE_BUTTON: Locator;
    readonly AGREE_BUTTON: Locator;
    readonly YES_BUTTON: Locator;
    readonly NO_BUTTON: Locator;
    readonly HANDLER_BUTTON: Locator;
    readonly CREATE_BILL_BUTTON: Locator;
    readonly PAYMENT_BUTTON: Locator;
    readonly CANCEL_BUTTON: Locator;




    // Inputs / Textareas
    readonly HANDLER: Locator;
    readonly NOTE: Locator;
    readonly QUANTITY_INPUT: Locator;
    readonly SEARCH_INPUT: Locator;
    readonly SEARCH_PRODUCT_INPUT: Locator;
    readonly REASON_INPUT: Locator;


    // Status Indicators / Labels


    // Dropdowns & Comboboxes
    readonly PRODUCT_NAME_COMBOBOX: Locator;
    readonly SEARCH_CUSTOMER_COMBOBOX: Locator;
    readonly SEARCH_PRODUCT_COMBOBOX: Locator;


    // Others
    readonly ROW_1: Locator;
    readonly FIRST_CHECKBOX: Locator;


    // Toast
    readonly SUCCESS_TOAST: Locator;
    readonly FAILED_TOAST: Locator;



    constructor(page: Page) {
        super(page);
        this.FIRST_CHECKBOX = page.getByRole('checkbox');
        this.CANCEL_BUTTON = page.getByRole('button', { name: 'Hủy' });
        this.REASON_INPUT = page.getByRole('textbox', { name: 'Lý do※' });
        this.YES_BUTTON = page.getByRole('button', { name: 'Có' });
        this.SUCCESS_TOAST = page.locator('//div[contains(text(),"Thành công")]');
        this.FAILED_TOAST = page.locator('//div[contains(text(),"Thất bại")]')
        this.SEARCH_PRODUCT_COMBOBOX = page.getByRole('combobox', { name: 'Tìm sản phẩm' });
        this.PAYMENT_BUTTON = page.getByRole('button', { name: 'Thanh toán' });
        this.CREATE_BILL_BUTTON = page.getByRole('button', { name: 'Tạo hóa đơn' });
        this.HANDLER_BUTTON = page.getByRole('button', { name: 'Xử lý' });
        this.SEARCH_PRODUCT_INPUT = page.getByRole('textbox', { name: 'Tìm kiếm sản phẩm' });
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
        this.SEARCH_CUSTOMER_COMBOBOX = page.getByRole('combobox', { name: 'Tìm khách hàng※' });
    }

    /* Menu Cards */
    getMenuCard(name: string) {
        return this.page.getByRole('heading', { name });
    }

    async clickMenuCard(name: string) {
        await this.getMenuCard(name).click();
    }
    /* Menu Cards */

    async fillReason(reason: string) {
        await this.safeFill(this.REASON_INPUT, reason);
    }

    async clickCancelButton() {
        await this.safeClick(this.CANCEL_BUTTON);
    }

    async clickFirstCheckbox() {
        await this.safeClick(this.FIRST_CHECKBOX, { nth: 0 });
    }

    async getToastSuccess() {
        await this.safeVerifyToHaveText(this.SUCCESS_TOAST, 'Thành công');
    }

    async getToastFailed() {
        await this.safeVerifyToHaveText(this.FAILED_TOAST, 'Thất bại');
    }

    async fillSearchProductCombobox(productName: string) {
        await this.safeFill(this.SEARCH_PRODUCT_COMBOBOX, productName);
        const option = this.page.getByRole('option', { name: productName });
        await this.safeClick(option, { nth: 0 });
    }

    async clickCreateBillButton() {
        await this.safeClick(this.CREATE_BILL_BUTTON);
    }

    async clickYesButton() {
        await this.safeClick(this.YES_BUTTON);
    }

    // CLICK NÚT XỬ LÝ
    async clickHandlerButton() {
        await this.safeClick(this.HANDLER_BUTTON);
    }

    async clickPaymentButton() {
        await this.safeClick(this.PAYMENT_BUTTON);
    }

    async fillCustomerNameCombobox(customerName: string) {
        await this.safeFill(this.SEARCH_CUSTOMER_COMBOBOX, customerName);
        const option = this.page.getByRole('option', { name: customerName });
        await this.safeClick(option, { nth: 0 });
    }

    async fillSearchProductInput(text: string) {
        await this.safeFill(this.SEARCH_PRODUCT_INPUT, text);
    }

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
