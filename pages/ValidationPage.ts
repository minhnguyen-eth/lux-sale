import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ValidationPage extends BasePage {
    readonly minlengthEmail = this.page.getByText('Không nhập dưới 6 kí tự.');
    readonly contractAlreadyApproved = this.page.getByText('Đã có hợp đồng được duyệt');
    readonly nameAlreadyExists = this.page.getByText('Tên đã tồn tại.');
    readonly requiredFillReason = this.page.getByText('Nhập lý do');
    readonly maxLength255Characters = this.page.getByText('Không nhập quá 255 kí tự.');
    readonly maxLength245Characters = this.page.getByText('Không nhập quá 245 kí tự.');
    readonly maxLength500Characters = this.page.getByText('Không nhập quá 500 kí tự.');
    readonly maxLength20Characters = this.page.getByText('Không nhập quá 20 kí tự.');
    readonly maxLength100Characters = this.page.getByText('Không nhập quá 100 kí tự.');
    readonly maxLength50Characters = this.page.getByText('Không nhập quá 50 kí tự.');
    readonly noExistData = this.page.getByText('Không có dữ liệu');

    constructor(page: Page) {
        super(page);
    }

    async validateMinlengthEmail() {
        await this.validate(this.minlengthEmail, 'Không nhập dưới 6 kí tự.');
    }

    async validateMaxLength245Characters() {
        await this.validate(this.maxLength245Characters, 'Không nhập quá 245 kí tự.');
    }

    async validateMaxLength50Characters() {
        await this.validate(this.maxLength50Characters, 'Không nhập quá 50 kí tự.');
    }

    async validate(locator: Locator, expected: string) {
        await this.safeVerifyToHaveText(locator, expected);
    }

    async validateNoExistData() {
        await this.validate(this.noExistData, 'Không có dữ liệu');
    }

    async validateNameAlreadyExists() {
        await this.validate(this.nameAlreadyExists, 'Tên đã tồn tại.');
    }

    async validateRequiredFillReason() {
        await this.validate(this.requiredFillReason, 'Nhập lý do');
    }

    async validateContractAlreadyApproved() {
        await this.validate(this.contractAlreadyApproved, 'Đã có hợp đồng được duyệt');
    }

    async validateMaxLength255Characters() {
        await this.validate(this.maxLength255Characters, 'Không nhập quá 255 kí tự.');
    }

    async validateMaxLength100Characters() {
        await this.validate(this.maxLength100Characters, 'Không nhập quá 100 kí tự.');
    }

    async validateMaxLength20Characters() {
        await this.validate(this.maxLength20Characters, 'Không nhập quá 20 kí tự.');
    }

    async validateMaxLength500Characters() {
        await this.validate(this.maxLength500Characters, 'Không nhập quá 500 kí tự.');
    }
}
