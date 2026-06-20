import { test, } from '../base-test';
import { LoginPage } from '../../pages/LoginPage';
import Config from '../../utils/configUtils';
import { allure } from 'allure-playwright';
import { ProductPage } from '../../pages/ProductPage';
import { ToastPage } from '../../pages/ToastPage';
import { SupplierPage } from '../../pages/SupplierPage';
import { BasePage } from '../../pages/BasePage';
import { OrderSupplierPage } from '../../pages/OrderSupplierPage';
import { PurchaseOrderPage } from '../../pages/PurchaseOrderPage';

test.describe.serial('FL-001', () => {
    let loginPage: LoginPage;
    let productPage: ProductPage;
    let toastPage: ToastPage;
    let supplierPage: SupplierPage;
    let orderSupplierPage: OrderSupplierPage;
    let purchaseOrderPage: PurchaseOrderPage;
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {

        allure.feature('FL-001');
        allure.owner('Minh Nguyen');
        allure.severity('Critical');

        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        toastPage = new ToastPage(page);
        supplierPage = new SupplierPage(page);
        orderSupplierPage = new OrderSupplierPage(page);
        purchaseOrderPage = new PurchaseOrderPage(page);
        basePage = new BasePage(page);
        await loginPage.goto();
    });

    /*
     FL-001 bao gồm:
     1. Tạo sản phẩm thành công
     2. Đặt hàng nhập SP mới tạo
        2.1 PRE-CONDITION: Tạo nhà cung cấp mới
     3. Tạo phiếu nhập - Nhập hàng
     4. Kiểm tra tồn kho sau khi nhập hàng
     5. Kiểm tra công nợ NCC
     6. Tạo phiếu đặt hàng
        6.1 PRE-CONDITION: Tạo khách hàng mới
     7. Tạo hóa đơn bán hàng & xử lý thanh toán
     8. Kiểm tra tồn kho
     9. Kiểm tra công nợ khách hàng
    */

    test('FL-001', async () => {
        allure.description(`
        FL-001:
        1. Tạo sản phẩm thành công
        2. Đặt hàng nhập SP mới tạo 
           2.1 PRE-CONDITION: Tạo nhà cung cấp mới
        3. Tạo phiếu nhập - Nhập hàng
        4. Kiểm tra tồn kho sau khi nhập hàng
        5. Kiểm tra công nợ NCC
        6. Tạo phiếu đặt hàng
           6.1 PRE-CONDITION: Tạo khách hàng mới
        7. Tạo hóa đơn bán hàng & xử lý thanh toán
        8. Kiểm tra tồn kho
        9. Kiểm tra công nợ khách hàng
    `);

        // Login
        await allure.step('Login with admin account', async () => {
            await loginPage.login(Config.admin_username, Config.admin_password);
        });

        // Truy cập màn hình SP
        await allure.step('Navigate to Product Page', async () => {
            await productPage.clickMenuCard('Sản phẩm');
        });

        // Tạo SP mới
        const productName = `Product${Math.floor(100000 + Math.random() * 900000)}`;
        await allure.step('Create a product successfully', async () => {
            await productPage.clickInsertButton();
            await productPage.fillProductName(productName);
            await productPage.fillCapitalPrice('10000');
            await productPage.fillRetailPrice('15000');
            await productPage.fillNote('This is a test product for FL-001');
            await productPage.clickSaveButton();
            await toastPage.getToastSuccess();
        });

        // Thêm nhà cung cấp mới
        const supplierName = `Supplier${Math.floor(100000 + Math.random() * 900000)}`;
        await allure.step('Create a new supplier', async () => {
            await supplierPage.clickSupplierLink();
            await productPage.clickInsertButton();
            await supplierPage.fillSupplierName(supplierName);
            await supplierPage.clickSaveButton();
            await toastPage.getToastSuccess();
        });

        // Tạo phiếu đặt hàng nhập
        await allure.step('Order supply for the new product', async () => {
            await orderSupplierPage.gotoOrderSupplierPage();
            await basePage.clickInsertButton();
            await basePage.fillProductNameCombobox(productName);
            await basePage.fillHandler('Test');
            await orderSupplierPage.fillSupplierName(supplierName);
            await basePage.fillQuantity('10'); // số lượng 10

            await basePage.fillNote('This is a test order for FL-001');
            await orderSupplierPage.clickOrderSupplierButton();
            // await toastPage.getToastSuccess();
        });

        // Tạo phiếu nhập từ đặt hàng nhập
        await allure.step('Create purchase order from the new product', async () => {
            await basePage.clickFirstRow();
            const newPage = await orderSupplierPage.clickCreatePurchaseOrderButton();
            const newBasePage = new BasePage(newPage);
            const newToastPage = new ToastPage(newPage);
            await newBasePage.clickDoneButton();
            await newBasePage.clickAgreeButton();
            await newToastPage.getToastSuccess();
            await newPage.close();
        });

        // Kiểm tra công nợ nhà cung cấp
        await allure.step('Verify supplier debt after purchase order', async () => {
            await supplierPage.gotoSupplierPage();
            await basePage.fillSearchInput(supplierName);
            await supplierPage.verifyCurrentDebt('100.000');
        });
    });
});