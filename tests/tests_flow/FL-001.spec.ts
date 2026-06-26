import { test, } from '../base-test';
import { LoginPage } from '../../pages/LoginPage';
import Config from '../../utils/configUtils';
import { allure } from 'allure-playwright';
import { ProductPage } from '../../pages/ProductPage';
import { SupplierPage } from '../../pages/SupplierPage';
import { BasePage } from '../../pages/BasePage';
import { OrderSupplierPage } from '../../pages/OrderSupplierPage';
import { PurchaseOrderPage } from '../../pages/PurchaseOrderPage';
import { CustomerPage } from '../../pages/CustomerPage';
import { MenuCardCommon } from '../../constants/MenuCardCommon';
import { OrderPage } from '../../pages/OrderPage';
import {
    clearCustomers, clearOrderSuppliers, clearPurchaseTransaction,
    clearSuppliers, clearProducts, clearOrders, clearBills
} from '../../db/helpers/DBHelper';

test.describe.serial('FL-001', () => {
    let loginPage: LoginPage;
    let productPage: ProductPage;
    let supplierPage: SupplierPage;
    let orderSupplierPage: OrderSupplierPage;
    let purchaseOrderPage: PurchaseOrderPage;
    let customerPage: CustomerPage;
    let orderPage: OrderPage;
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {

        allure.feature('FL-001');
        allure.owner('Minh Nguyen');
        allure.severity('Critical');

        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        supplierPage = new SupplierPage(page);
        orderSupplierPage = new OrderSupplierPage(page);
        purchaseOrderPage = new PurchaseOrderPage(page);
        customerPage = new CustomerPage(page);
        orderPage = new OrderPage(page);
        basePage = new BasePage(page);

        // clear data
        await clearCustomers();
        await clearSuppliers();
        await clearProducts();
        await clearOrders();
        await clearBills();
        await clearOrderSuppliers();
        await clearPurchaseTransaction();
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

        const capitalPrice = '10.000';      // giá vốn
        const retailPrice = '15.000';       // giá bán
        const quantity = '10';             // số lượng nhập
        const debt_supplier_after_purchase = '100.000';    // công nợ NCC
        const debt_customer_after_sale = '15.000';    // công nợ khách hàng
        const inventory_after_purchase = '10'; // tồn kho sau khi nhập hàng
        const inventory_after_order = '10';    // tồn kho sau khi đặt hàng
        const inventory_after_sale = '9';      // tồn kho sau khi bán hàng

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
            await loginPage.login(Config.manager_username, Config.manager_password);
        });

        // Truy cập màn hình Sản phẩm
        await allure.step('Navigate to Product Page', async () => {
            await productPage.clickMenuCard(MenuCardCommon.PRODUCT);
        });

        // Tạo SP mới
        const productName = `Product${Math.floor(100000 + Math.random() * 900000)}`;
        await allure.step('Create a product successfully', async () => {
            await productPage.clickInsertButton();
            await productPage.fillProductName(productName);
            await productPage.fillCapitalPrice(capitalPrice);
            await productPage.fillRetailPrice(retailPrice);
            await productPage.fillNote('This is a test product for FL-001');
            await productPage.clickSaveButton();
            await productPage.getToastSuccess();
        });

        // Thêm nhà cung cấp mới
        const supplierName = `Supplier${Math.floor(100000 + Math.random() * 900000)}`;
        await allure.step('Create a new supplier', async () => {
            await supplierPage.clickSupplierLink();
            await productPage.clickInsertButton();
            await supplierPage.fillSupplierName(supplierName);
            await supplierPage.clickSaveButton();
            await productPage.getToastSuccess();
        });

        // Tạo phiếu đặt hàng nhập
        await allure.step('Order supply for the new product', async () => {
            await orderSupplierPage.gotoOrderSupplierPage();
            await basePage.clickInsertButton();
            await basePage.fillProductNameCombobox(productName);
            await basePage.fillHandler('Test');
            await orderSupplierPage.fillSupplierName(supplierName);
            await basePage.fillQuantity(quantity); // số lượng 10

            await basePage.fillNote('This is a test order for FL-001');
            await orderSupplierPage.clickOrderSupplierButton();
            // await productPage.getToastSuccess();
        });

        // Tạo phiếu nhập từ đặt hàng nhập
        await allure.step('Create purchase order from the new product', async () => {
            await basePage.clickFirstRow();
            const newPage = await orderSupplierPage.clickCreatePurchaseOrderButton();
            await newPage.waitForLoadState('networkidle');
            const newBasePage = new BasePage(newPage);
            await newBasePage.clickDoneButton(); // Click "Hoàn thành" để tạo phiếu nhập
            await newBasePage.clickAgreeButton(); // Click "Đồng ý" để xác nhận tạo phiếu nhập
            // await newBasePage.getToastSuccess();
            await newPage.close();
        });

        // Kiểm tra công nợ nhà cung cấp
        await allure.step('Verify supplier debt after purchase order', async () => {
            await supplierPage.gotoSupplierPage();
            await basePage.fillSearchInput(supplierName); // tìm kiếm nhà cung cấp vừa tạo
            await supplierPage.verifyCurrentDebt(debt_supplier_after_purchase); // công nợ 100.000
        });

        // Kiểm tra tồn kho sau khi nhập hàng
        await allure.step('Verify product stock after purchase order', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(productName); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(inventory_after_purchase); // tồn kho 10
        });

        // Tạo khách hàng mới
        const customerName = `Customer${Math.floor(100000 + Math.random() * 900000)}`;
        await allure.step('Create a new customer', async () => {
            await customerPage.gotoCustomerPage();
            await basePage.clickInsertButton();
            await customerPage.fillCustomerNameInput(customerName);
            await basePage.clickSaveButton();
            await productPage.getToastSuccess();
        });

        // Tạo phiếu đặt hàng 
        await allure.step('Create a new order for the new customer', async () => {
            await orderPage.gotoOrderPage();
            await orderPage.clickOrderButton();
            await basePage.fillSearchProductCombobox(productName);
            await basePage.fillHandler('Test');
            await basePage.fillCustomerNameCombobox(customerName);
            await orderPage.clickOrderButtonFormPayment();
            await productPage.getToastSuccess();
        });

        // Kiểm tra tồn kho sau khi đặt hàng
        await allure.step('Verify product stock after order, Inventory = 9', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(productName); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(inventory_after_order); // tồn kho 10
        });

        // Tạo hóa đơn bán hàng & xử lý thanh toán
        await allure.step('Create invoice and process payment', async () => {
            await orderPage.gotoOrderPage();
            await orderPage.clickFirstRow(); // click vào đơn hàng vừa tạo

            const paymentPage = await orderPage.openHandlerPage(); // click nút Xử lý, hệ thống mở tab mới
            const paymentBasePage = new BasePage(paymentPage);

            await paymentBasePage.clickCreateBillButton(); // click Tạo hóa đơn để tạo hóa đơn
            await paymentBasePage.clickPaymentButton(); // click THANH TOÁN để xác nhận tạo hóa đơn
            await paymentBasePage.getToastSuccess();
            await paymentPage.close();
        });


        // Kiểm tra tồn kho sau khi bán hàng
        await allure.step('Verify product stock after order, Inventory = 9', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(productName); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(inventory_after_sale); // tồn kho 9
        });

        // Kiểm tra công nợ khách hàng       
        await allure.step('Verify customer debt after sale', async () => {
            await customerPage.gotoCustomerPage();
            await customerPage.fillSearchCustomerInput(customerName); // tìm kiếm khách hàng vừa tạo
            await customerPage.verifyCurrentDebtOfCustomer(debt_customer_after_sale, 2); // công nợ bằng giá bán 15.000
        });
    });
});
