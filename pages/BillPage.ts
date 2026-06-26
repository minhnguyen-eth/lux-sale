import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import Config from '../utils/configUtils';

export class BillPage extends BasePage {

    readonly BILL_PAGE: Locator;
    readonly DISCOUNT_TEXTBOX: Locator;
    readonly DISCOUNT_INPUT: Locator;
    readonly CLIENT_PAYMENT_INPUT: Locator;
    readonly SEARCH_CUSTOMER_COMBOBOX: Locator;
    readonly RETURN_PRODUCT_BUTTON: Locator;
    readonly RETURN_QUANTITY_INPUT: Locator;
    readonly PAIR_BY_CUSTOMER: Locator;
    readonly PRODUCT_FILTERS_COMBOBOX: Locator;
    readonly PRODUCT_FILTERS_INPUT: Locator;



    constructor(page: Page) {
        super(page);
        this.PRODUCT_FILTERS_COMBOBOX = page.getByText('(0) Sản phẩm', { exact: true });
        this.PRODUCT_FILTERS_INPUT = page.locator("//div[6]/div/div/div/div[3]/div/input");
        this.PAIR_BY_CUSTOMER = page.locator("//form/div[1]/div[3]/div[3]/p[2]/div/div/div/div[3]/input");
        this.RETURN_PRODUCT_BUTTON = page.getByRole('button', { name: 'Trả hàng' });
        this.BILL_PAGE = page.getByText('Hóa đơn', { exact: true });
        this.DISCOUNT_TEXTBOX = page.locator("//form/div/div[3]/div[2]/div[1]/div/div/div/div[3]/input");
        this.DISCOUNT_INPUT = page.locator("//div/div/div/div[2]/div/div/div/div[3]/input");
        this.CLIENT_PAYMENT_INPUT = page.locator("//form/div/div[3]/div[2]/div[3]/div/div/div[3]/input");
        this.SEARCH_CUSTOMER_COMBOBOX = page.getByRole('combobox', { name: 'Tìm khách hàng' })
        this.RETURN_QUANTITY_INPUT = page.locator(`//tr[td[contains(., '1')]]//input[@type='text']`);

    }

    async fillProductFiltersCombobox(productName: string) {
        await this.safeClick(this.PRODUCT_FILTERS_COMBOBOX);
        await this.safeFill(this.PRODUCT_FILTERS_INPUT, productName);
        const option = this.page.getByRole('option', { name: productName });
        await this.safeClick(option, { nth: 0 });
    }

    async fillPairByCustomer(pair: string) {
        await this.safeFill(this.PAIR_BY_CUSTOMER, pair);
    }

    async openReturnProductPage() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.safeClick(this.RETURN_PRODUCT_BUTTON)
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    async confirmReturnProduct() {
        await this.safeClick(this.RETURN_PRODUCT_BUTTON);
    }

    async fillReturnQuantity(quantity: string) {
        await this.safeFill(this.RETURN_QUANTITY_INPUT, quantity);
    }


    async fillClientPayment(payment: string) {
        await this.safeFill(this.CLIENT_PAYMENT_INPUT, payment);
    }

    async fillSearchCustomerComboboxInBill(customerName: string) {
        await this.safeFill(this.SEARCH_CUSTOMER_COMBOBOX, customerName);
        const option = this.page.getByRole('option', { name: customerName });
        await this.safeClick(option, { nth: 0 });
    }

    async fillDiscount(discount: string) {
        await this.safeClick(this.DISCOUNT_TEXTBOX);
        await this.safeFill(this.DISCOUNT_INPUT, discount);
    }

    async gotoBill() {
        await this.page.goto(Config.urlStaging + '/bill');
    }

    async clickBillPage() {
        await this.safeClick(this.BILL_PAGE)
    }

    async verifyBill(expectedBill: string, nth: number = 0) {
        const billCell = this.page
            .locator('td')
            .getByText(expectedBill, { exact: true })
            .nth(nth);

        await this.safeVerifyToHaveText(billCell, expectedBill);
    }
}
