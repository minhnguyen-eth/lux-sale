import { Page, Locator, expect } from '@playwright/test';
import Config from '../utils/configUtils';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  readonly USERNAME_INPUT: Locator;
  readonly PASSWORD_INPUT: Locator;
  readonly MANAGEMENT_BUTTON: Locator;
  readonly profileBadgeAdmin: Locator;
  readonly profileBadgeEmployee: Locator;
  readonly errorMessage: Locator;
  readonly validateUsername: Locator;
  readonly validatePassword: Locator;

  constructor(page: Page) {
    super(page);
    this.validateUsername = page.locator("//div[contains(text(),'Nhập email hoặc số điện thoại')]");
    this.validatePassword = page.locator("//div[contains(text(),'Nhập mật khẩu')]");
    this.USERNAME_INPUT = page.getByRole('textbox', { name: 'Tên đăng nhập※' });
    this.PASSWORD_INPUT = page.getByRole('textbox', { name: 'Mật khẩu※' });
    this.MANAGEMENT_BUTTON = page.getByRole('button', { name: 'Quản trị' });
    this.profileBadgeAdmin = page.locator("//div[@class='v-chip__content']//span[contains(text(),'Admin')]");
    this.profileBadgeEmployee = page.locator("//div[@class='v-chip__content']//span[contains(text(),'Nguyễn Văn Minh')]");
    this.errorMessage = page.locator("//li[contains(text(),'Tên đăng nhập hoặc mật khẩu không đúng')]");
  }

  async goto() {
    await this.page.waitForLoadState('load');
    await this.page.goto(Config.urlStaging);
  }

  async expectUsernameValidate() {
    await this.safeVerifyToHaveText(this.validateUsername, 'Nhập email hoặc số điện thoại');
  }

  async expectPasswordValidate() {
    await this.safeVerifyToHaveText(this.validatePassword, 'Nhập mật khẩu');
  }

  async login(username: string, password: string) {
    await this.safeFill(this.USERNAME_INPUT, username);
    await this.safeFill(this.PASSWORD_INPUT, password);
    await this.safeClick(this.MANAGEMENT_BUTTON);
  }

  async expectLoginSuccess(dashboardName: string) {
    const dashboard = this.page.getByText(dashboardName, { exact: true });
    await this.safeVerifyTextContains(dashboard, dashboardName);
  }

  async expectLoginError() {
    await this.safeVerifyTextContains(this.errorMessage, 'Tên đăng nhập hoặc mật khẩu không đúng');
  }
}
