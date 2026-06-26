import { test, } from './base-test';
import { LoginPage } from '../pages/LoginPage';
import Config from '../utils/configUtils';
import { allure } from 'allure-playwright';
import { BillPage } from '../pages/BillPage';
import { ProductPage } from '../pages/ProductPage';
import { clearBills, clearCustomers, clearProducts } from '../db/helpers/DBHelper';
import { BasePage } from '../pages/BasePage';
import { MenuCardCommon } from '../constants/MenuCardCommon';
import { CustomerPage } from '../pages/CustomerPage';
import { clearReturnProduct } from '../db/modules/ReturnProductDB';
import { ReturnProductPage } from '../pages/ReturnProductPage';
import { TestDataGenerator } from '../test-data/TestDataGenerator';
import { BillData } from '../test-data/BillData';


test.describe.serial('Bill Tests', () => {
    let loginPage: LoginPage;
    let billPage: BillPage;
    let productPage: ProductPage;
    let basePage: BasePage;
    let customerPage: CustomerPage;
    let returnProductPage: ReturnProductPage;


    test.beforeEach(async ({ page }) => {

        allure.feature('Bill Feature');
        allure.owner('Minh Nguyen');
        allure.severity('Critical');

        loginPage = new LoginPage(page);
        billPage = new BillPage(page);
        productPage = new ProductPage(page);
        customerPage = new CustomerPage(page);
        returnProductPage = new ReturnProductPage(page);
        basePage = new BasePage(page);
        await loginPage.goto();
    });

    /*TC-B001: Bán hàng cho khách lẻ không thanh toán, không giảm giá 
    1. Thêm sản phẩm giá bán 15.000, tồn kho 2
    2. Bán hàng cho khách lẻ không thanh toán 
    3. kiểm tra tồn kho sau khi bán = 1
    4. Kiểm tra hóa đơn tổng tiền hóa đơn 15.000, giảm giá 0, tiền khách trả 0
    5. Hủy bill 
    6. Kiểm tra tồn kho sau khi hủy = 2
     */

    test('TC-B001 Selling to retail customers and checking inventory', async () => {

        await clearBills();
        await clearProducts();

        const data = BillData.TC_B001;
        const PRODUCT_NAME = TestDataGenerator.getProductName();

        allure.description(`
           TC-B001: Bán hàng cho khách lẻ không thanh toán, không giảm giá 
            1. Thêm sản phẩm giá bán 15.000, tồn kho 2
            2. Bán hàng cho khách lẻ không thanh toán 
            3. kiểm tra tồn kho sau khi bán = 1
            4. Kiểm tra hóa đơn tổng tiền hóa đơn 15.000, giảm giá 0, tiền khách trả 0
            5. Hủy bill 
            6. Kiểm tra tồn kho sau khi hủy = 2
            `);

        await allure.step('Login with admin account', async () => {
            await loginPage.login(Config.manager_username, Config.manager_password);
        });

        // await productPage.gotoProductPage();
        await basePage.clickMenuCard(MenuCardCommon.PRODUCT);

        await allure.step('Add a product', async () => {
            await productPage.addProduct(
                PRODUCT_NAME,
                data.CAPITAL_PRICE,
                data.RETAIL_PRICE,
                data.INVENTORY_QUANTITY
            );
        });

        await allure.step('Create a bill for retail customer', async () => {
            await billPage.gotoBill();
            await billPage.clickInsertButton();
            await billPage.fillSearchProductCombobox(PRODUCT_NAME);
            await billPage.fillHandler(data.HANDLER);
            await billPage.clickPaymentButton();
            await billPage.clickYesButton();
            await billPage.getToastSuccess();
        });

        // Kiểm tra tồn kho sau khi bán hàng
        await allure.step('Verify product stock after order, Inventory = 9', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_SALE); // tồn kho 1
        });

        // Kiểm tra hóa đơn sau khi bán hàng 
        await allure.step('Verify invoice after order', async () => {
            await billPage.gotoBill();
            await billPage.clickBillPage();
            await billPage.fillProductFiltersCombobox(PRODUCT_NAME);
            await billPage.verifyBill(data.TOTAL_COST_OF_BILL, 0); // Tổng tiền của bill, 0 là lấy phần tử đầu tiên
            await billPage.verifyBill(data.DISCOUNT, 0); // Giảm giá, 0 là phần từ điều tiên
            await billPage.verifyBill(data.PAIR_BY_CUSTOMER, 1); // 1 là lấy phần tử thứ 2 vì trùng với discount
        });

        await allure.step('Cancel a bill', async () => {
            await billPage.clickFirstRow();
            await billPage.clickCancelButton();
            await billPage.fillReason('Test');
            await billPage.clickYesButton();
            await billPage.getToastSuccess();
        });

        // Kiểm tra tồn kho sau khi hủy bill
        await allure.step('Verify inventory after cancel bill', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_CANCEL_BILL); // tồn kho 2
        });
    });

    /*TC-B002: Bán hàng cho khách lẻ có thanh toán đủ, có giảm giá 
     1. Thêm sản phẩm giá bán 15.000, tồn kho 2
     2. Bán hàng cho khách lẻ có thanh toán đủ, giá bán: 15.000, giảm giá 5.000 
     3. kiểm tra tồn kho sau khi bán = 1
     4. Kiểm tra hóa đơn tổng tiền hóa đơn 15.000, giảm giá 5.000, tiền khách trả 10.000
   */
    test('TC-B002: Selling to retail customers and checking inventory', async () => {

        await clearBills();
        await clearProducts();
        const data = BillData.TC_B002;
        const PRODUCT_NAME = TestDataGenerator.getProductName();
        const CUSTOMER_NAME = TestDataGenerator.getCustomerName();

        allure.description(`
          TC-B002: Bán hàng cho khách lẻ có thanh toán đủ, có giảm giá 
            1. Thêm sản phẩm giá bán 15.000, tồn kho 2
            2. Bán hàng cho khách lẻ có thanh toán đủ, giá bán: 15.000, giảm giá 5.000 
            3. kiểm tra tồn kho sau khi bán = 1
            4. Kiểm tra hóa đơn tổng tiền hóa đơn 15.000, giảm giá 5.000, tiền khách trả 10.000
            `);

        await allure.step('Login with admin account', async () => {
            await loginPage.login(Config.manager_username, Config.manager_password);
        });

        // await productPage.gotoProductPage();
        await basePage.clickMenuCard(MenuCardCommon.PRODUCT);

        await allure.step('Add a product', async () => {
            await productPage.addProduct(
                PRODUCT_NAME,
                data.CAPITAL_PRICE,
                data.RETAIL_PRICE,
                data.INVENTORY_QUANTITY
            );
        });

        await allure.step('Create a bill for retail customer', async () => {
            await billPage.gotoBill();
            await billPage.clickInsertButton();
            await billPage.fillSearchProductCombobox(PRODUCT_NAME);
            await billPage.fillHandler(data.HANDLER);
            await billPage.fillDiscount(data.DISCOUNT_BILL); // giảm giá 5.000
            await billPage.fillClientPayment(data.CLIENT_PAYMENT); // thanh toán 10.000
            await billPage.clickPaymentButton();
            await billPage.clickYesButton();
            await billPage.getToastSuccess();
        });

        // Kiểm tra tồn kho sau khi bán hàng
        await allure.step('Verify product stock after order, Inventory = 9', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_SALE); // tồn kho 1
        });

        // Kiểm tra hóa đơn sau khi bán hàng 
        await allure.step('Verify invoice after order', async () => {
            await billPage.gotoBill();
            await billPage.clickBillPage();
            await billPage.fillProductFiltersCombobox(PRODUCT_NAME);
            await billPage.verifyBill(data.TOTAL_COST_OF_BILL, 0); // Tổng tiền của bill, 0 là lấy phần tử đầu tiên
            await billPage.verifyBill(data.DISCOUNT, 0); // Giảm giá, 0 là phần từ điều tiên
            await billPage.verifyBill(data.PAIR_BY_CUSTOMER, 0); // 1 là lấy phần tử thứ 2 vì trùng với discount
        });
    });

    // TC-B003 Trả hàng toàn bộ từ hóa đơn
    test('TC-B003:Return goods from an invoice', async () => {

        await clearBills();
        await clearProducts();
        await clearCustomers();
        await clearReturnProduct();

        const data = BillData.TC_B003;
        const PRODUCT_NAME = TestDataGenerator.getProductName();
        const CUSTOMER_NAME = TestDataGenerator.getCustomerName();

        allure.description(`
          TC-B003: Trả hàng từ hóa đơn kiểm tra công nợ & tồn kho
            1. Thêm sản phẩm giá bán 15.000, tồn kho 2
            2. Bán hàng cho khách thanh toán đủ, giá bán: 15.000, giảm giá 5.000 
               2.1 Pre-condition: Thêm mới khách hàng
            3. kiểm tra tồn kho sau khi bán = 1
            4. Kiểm tra hóa đơn tổng tiền hóa đơn 15.000, giảm giá 0, tiền khách trả 15.000
            5. Kiểm tra công nợ khách hàng = 0
            6. Trả hàng từ hóa đơn
            7. Kiểm tra tồn kho sau khi trả hàng = 2
            `);

        await allure.step('Login with admin account', async () => {
            await loginPage.login(Config.manager_username, Config.manager_password);
        });

        // await productPage.gotoProductPage();
        await basePage.clickMenuCard(MenuCardCommon.PRODUCT);

        await allure.step('Add a product', async () => {
            await productPage.addProduct(
                PRODUCT_NAME,
                data.CAPITAL_PRICE,
                data.RETAIL_PRICE,
                data.INVENTORY_QUANTITY
            );
        });

        // Tạo khách hàng mới
        await allure.step('Create a new customer', async () => {
            await customerPage.gotoCustomerPage();
            await basePage.clickInsertButton();
            await customerPage.fillCustomerNameInput(CUSTOMER_NAME);
            await basePage.clickSaveButton();
            await productPage.getToastSuccess();
        });

        await allure.step('Create a bill for customer and payment', async () => {
            await billPage.gotoBill();
            await billPage.clickInsertButton();
            await billPage.fillSearchProductCombobox(PRODUCT_NAME);
            await billPage.fillHandler(data.HANDLER);
            await billPage.fillSearchCustomerComboboxInBill(CUSTOMER_NAME);
            await billPage.fillClientPayment(data.CLIENT_PAYMENT); // thanh toán 15.000
            await billPage.clickPaymentButton();
            await billPage.getToastSuccess();
        });

        // Kiểm tra tồn kho sau khi bán hàng
        await allure.step('Verify product stock after order, Inventory = 9', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_SALE); // tồn kho 1
        });

        // Kiểm tra hóa đơn sau khi bán hàng 
        await allure.step('Verify invoice after order', async () => {
            await billPage.gotoBill();
            await billPage.clickBillPage();
            await billPage.fillProductFiltersCombobox(PRODUCT_NAME);
            await billPage.verifyBill(data.TOTAL_COST_OF_BILL, 0); // Tổng tiền của bill, 0 là lấy phần tử đầu tiên
            await billPage.verifyBill(data.DISCOUNT, 0); // Giảm giá, 0 là phần từ điều tiên
            await billPage.verifyBill(data.PAIR_BY_CUSTOMER, 0); // 1 là lấy phần tử thứ 2 vì trùng với discount
        });

        // Kiểm tra công nợ khách hàng       
        await allure.step('Verify customer debt after sale', async () => {
            await customerPage.gotoCustomerPage();
            await customerPage.fillSearchCustomerInput(CUSTOMER_NAME); // tìm kiếm khách hàng vừa tạo
            await customerPage.verifyCurrentDebtOfCustomer(data.DEBT_AFTER_SALE, 0); // công nợ bằng giá bán 15.000
            console.log('Đã kiểm tra công nợ khách hàng sau bán hàng');
        });

        // Trả hàng 
        await allure.step('Return goods from an invoice', async () => {
            await billPage.gotoBill();
            await billPage.clickFirstRow();
            const newPage = await billPage.openReturnProductPage();
            await newPage.waitForLoadState('networkidle');

            const newBillPage = new BillPage(newPage);
            await newBillPage.fillReturnQuantity(data.RETURN_QUANTITY);
            // await newBillPage.clickReturnProductButton();
            await newBillPage.fillPairByCustomer(data.PAIR_BY_CUSTOMER_RETURN);
            await newBillPage.confirmReturnProduct();
            await newPage.close();
            console.log('Đã trả hàng');
        });

        // Verify trả hàng 
        await allure.step('Verify return goods from an invoice', async () => {
            await returnProductPage.gotoReturnProductage();
            await returnProductPage.verifyReturnProduct(data.NEED_PAIR);
            await returnProductPage.verifyReturnProduct(data.CUSTOMER_HAS_PAID);
            console.log('Đã verify trả hàng');
        });

        // Kiểm tra công nợ khách hàng sau trả hàng     
        await allure.step('Verify customer debt after sale', async () => {
            await customerPage.gotoCustomerPage();
            await customerPage.fillSearchCustomerInput(CUSTOMER_NAME); // tìm kiếm khách hàng vừa tạo
            await customerPage.verifyCurrentDebtOfCustomer(data.DEBT_AFTER_SALE, 0); // công nợ bằng giá bán 15.000
            console.log('Đã Kiểm tra công nợ khách hàng sau trả hàng ');
        });

        // Kiểm tra tồn kho sau trả hàng
        await allure.step('Verify product stock after order, Inventory = 9', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_RETURN); // tồn kho 2
            console.log('Đã Kiểm tra tồn kho sau trả hàng ');
        });
    });

    // TC-B004: Bán hàng cho khách nợ 100% hóa đơn
    test('TC-B004: Selling to customers with debt 100% from an invoice', async () => {

        await clearBills();
        await clearProducts();
        await clearCustomers();

        const data = BillData.TC_B004;
        const PRODUCT_NAME = TestDataGenerator.getProductName();
        const CUSTOMER_NAME = TestDataGenerator.getCustomerName();

        allure.description(`
          TC-B004: Bán hàng cho khách nợ 100% hóa đơn 
            1. Thêm sản phẩm giá bán 15.000, tồn kho 2
            2. Bán hàng cho khách thanh toán đủ, giá bán: 15.000, giảm giá 0 
               2.1 Pre-condition: Thêm mới khách hàng
            3. kiểm tra tồn kho sau khi bán = 1
            4. Kiểm tra hóa đơn tổng tiền hóa đơn 15.000, giảm giá 0, tiền khách trả 0
            5. Kiểm tra công nợ khách hàng = 15.000
            `);

        await allure.step('Login with admin account', async () => {
            await loginPage.login(Config.manager_username, Config.manager_password);
        });

        // await productPage.gotoProductPage();
        await basePage.clickMenuCard(MenuCardCommon.PRODUCT);

        await allure.step('Add a product', async () => {
            await productPage.addProduct(
                PRODUCT_NAME,
                data.CAPITAL_PRICE,
                data.RETAIL_PRICE,
                data.INVENTORY_QUANTITY
            );
        });

        // Tạo khách hàng mới
        await allure.step('Create a new customer', async () => {
            await customerPage.gotoCustomerPage();
            await basePage.clickInsertButton();
            await customerPage.fillCustomerNameInput(CUSTOMER_NAME);
            await basePage.clickSaveButton();
            await productPage.getToastSuccess();
            console.log('ĐÃ TẠO KHÁCH HÀNG')
        });

        await allure.step('Create a bill for customer and payment', async () => {
            await billPage.gotoBill();
            await billPage.clickInsertButton();
            await billPage.fillSearchProductCombobox(PRODUCT_NAME);
            await billPage.fillHandler(data.HANDLER);
            await billPage.fillSearchCustomerComboboxInBill(CUSTOMER_NAME);
            await billPage.fillClientPayment(data.CLIENT_PAYMENT); // thanh toán 0
            await billPage.clickPaymentButton();
            await billPage.getToastSuccess();
            console.log('ĐÃ TẠO HÓA ĐƠN')
        });

        // Kiểm tra tồn kho sau khi bán hàng
        await allure.step('Verify product stock after order, Inventory = 9', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME); // tìm kiếm sản phẩm vừa tạo
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_SALE); // tồn kho 1
            console.log('ĐÃ KIỂM TRA TỒN KHO')
        });

        // Kiểm tra hóa đơn sau khi bán hàng 
        await allure.step('Verify invoice after order', async () => {
            await billPage.gotoBill();
            await billPage.clickBillPage();
            await billPage.fillProductFiltersCombobox(PRODUCT_NAME);
            await billPage.verifyBill(data.TOTAL_COST_OF_BILL, 0); // Tổng tiền của bill, 0 là lấy phần tử đầu tiên
            await billPage.verifyBill(data.DISCOUNT, 0); // Giảm giá, 0 là phần từ điều tiên
            await billPage.verifyBill(data.PAIR_BY_CUSTOMER, 1);
        });

        // Kiểm tra công nợ khách hàng       
        await allure.step('Verify customer debt after sale', async () => {
            await customerPage.gotoCustomerPage();
            await customerPage.fillSearchCustomerInput(CUSTOMER_NAME); // tìm kiếm khách hàng vừa tạo
            await customerPage.verifyCurrentDebtOfCustomer(data.DEBT_AFTER_SALE, 2); // công nợ bằng giá bán 15.000
            console.log('Đã kiểm tra công nợ khách hàng sau bán hàng');
        });
    });

    // TC-B005: Bán hàng thanh toán một phần
    test('TC-B005: Selling to customers with partial payment', async () => {

        await clearBills();
        await clearProducts();
        await clearCustomers();

        const data = BillData.TC_B005;
        const PRODUCT_NAME = TestDataGenerator.getProductName();
        const CUSTOMER_NAME = TestDataGenerator.getCustomerName();

        allure.description(`
        TC-B005: Bán hàng thanh toán một phần
        1. Thêm sản phẩm giá bán 15.000, tồn kho 2
        2. Tạo khách hàng mới
        3. Bán hàng cho khách:
           - Giá bán: 15.000
           - Giảm giá: 0
           - Khách thanh toán: 5.000
        4. Kiểm tra tồn kho sau bán = 1
        5. Kiểm tra hóa đơn:
           - Tổng tiền: 15.000
           - Giảm giá: 0
           - Tiền khách trả: 5.000
        6. Kiểm tra công nợ khách hàng = 10.000
    `);

        await allure.step('Login with admin account', async () => {
            await loginPage.login(Config.manager_username, Config.manager_password);
        });

        await basePage.clickMenuCard(MenuCardCommon.PRODUCT);

        await allure.step('Add a product', async () => {
            await productPage.addProduct(
                PRODUCT_NAME,
                data.CAPITAL_PRICE,
                data.RETAIL_PRICE,
                data.INVENTORY_QUANTITY
            );
        });

        await allure.step('Create a new customer', async () => {
            await customerPage.gotoCustomerPage();
            await basePage.clickInsertButton();
            await customerPage.fillCustomerNameInput(CUSTOMER_NAME);
            await basePage.clickSaveButton();
            await productPage.getToastSuccess();
            console.log('ĐÃ TẠO KHÁCH HÀNG');
        });

        await allure.step('Create a bill with partial payment', async () => {
            await billPage.gotoBill();
            await billPage.clickInsertButton();
            await billPage.fillSearchProductCombobox(PRODUCT_NAME);
            await billPage.fillHandler(data.HANDLER);
            await billPage.fillSearchCustomerComboboxInBill(CUSTOMER_NAME);
            await billPage.fillClientPayment(data.CLIENT_PAYMENT); // thanh toán một phần
            await billPage.clickPaymentButton();
            await billPage.getToastSuccess();
            console.log('ĐÃ TẠO HÓA ĐƠN');
        });

        await allure.step('Verify product stock after sale', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME);
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_SALE);
            console.log('ĐÃ KIỂM TRA TỒN KHO');
        });

        await allure.step('Verify invoice after sale', async () => {
            await billPage.gotoBill();
            await billPage.clickBillPage();
            await billPage.fillProductFiltersCombobox(PRODUCT_NAME);

            await billPage.verifyBill(data.TOTAL_COST_OF_BILL, 0);
            await billPage.verifyBill(data.DISCOUNT, 0);
            await billPage.verifyBill(data.PAIR_BY_CUSTOMER, 0);
        });

        await allure.step('Verify customer debt after sale', async () => {
            await customerPage.gotoCustomerPage();
            await customerPage.fillSearchCustomerInput(CUSTOMER_NAME);
            await customerPage.verifyCurrentDebtOfCustomer(data.DEBT_AFTER_SALE, 0);
            console.log('ĐÃ KIỂM TRA CÔNG NỢ KHÁCH HÀNG');
        });
    });
    // TC-B006: Hủy hóa đơn của khách hàng còn công nợ và kiểm tra công nợ + tồn kho
    test('TC-B006: Cancel bill and verify customer debt', async () => {

        await clearBills();
        await clearProducts();
        await clearCustomers();

        const data = BillData.TC_B006;
        const PRODUCT_NAME = TestDataGenerator.getProductName();
        const CUSTOMER_NAME = TestDataGenerator.getCustomerName();

        allure.description(`
        TC-B006: Hủy hóa đơn của khách hàng còn công nợ và kiểm tra công nợ + tồn kho
        1. Thêm sản phẩm giá bán 15.000, tồn kho 2
        2. Tạo khách hàng mới
        3. Bán hàng:
           - Giá bán: 15.000
           - Khách thanh toán: 5.000
        4. Kiểm tra tồn kho = 1
        5. Kiểm tra công nợ = 10.000
        6. Hủy hóa đơn
        7. Kiểm tra tồn kho = 2
        8. Kiểm tra công nợ = 0
    `);

        await allure.step('Login with admin account', async () => {
            await loginPage.login(Config.manager_username, Config.manager_password);
        });

        await basePage.clickMenuCard(MenuCardCommon.PRODUCT);

        await allure.step('Add a product', async () => {
            await productPage.addProduct(
                PRODUCT_NAME,
                data.CAPITAL_PRICE,
                data.RETAIL_PRICE,
                data.INVENTORY_QUANTITY
            );
        });

        await allure.step('Create a new customer', async () => {
            await customerPage.gotoCustomerPage();
            await basePage.clickInsertButton();
            await customerPage.fillCustomerNameInput(CUSTOMER_NAME);
            await basePage.clickSaveButton();
            await productPage.getToastSuccess();
        });

        await allure.step('Create bill with partial payment', async () => {
            await billPage.gotoBill();
            await billPage.clickInsertButton();
            await billPage.fillSearchProductCombobox(PRODUCT_NAME);
            await billPage.fillHandler(data.HANDLER);
            await billPage.fillSearchCustomerComboboxInBill(CUSTOMER_NAME);
            await billPage.fillClientPayment(data.CLIENT_PAYMENT);
            await billPage.clickPaymentButton();
            await billPage.getToastSuccess();
        });

        await allure.step('Verify inventory after sale', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME);
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_SALE);
        });

        await allure.step('Verify customer debt after sale', async () => {
            await customerPage.gotoCustomerPage();
            await customerPage.fillSearchCustomerInput(CUSTOMER_NAME);
            await customerPage.verifyCurrentDebtOfCustomer(data.DEBT_AFTER_SALE, 0);
        });

        await allure.step('Cancel bill', async () => {
            await billPage.gotoBill();
            await billPage.clickFirstRow();
            await billPage.clickCancelButton();
            await billPage.fillReason('Automation Test');
            await billPage.clickYesButton();
            await billPage.getToastSuccess();
        });

        await allure.step('Verify inventory after cancel bill', async () => {
            await productPage.gotoProductPage();
            await productPage.fillSearchProductInput(PRODUCT_NAME);
            await productPage.verifyInventoryQuantity(data.INVENTORY_AFTER_CANCEL_BILL);
        });

        await allure.step('Verify customer debt after cancel bill', async () => {
            await customerPage.gotoCustomerPage();
            await customerPage.fillSearchCustomerInput(CUSTOMER_NAME);
            await customerPage.verifyCurrentDebtOfCustomer(data.DEBT_AFTER_CANCEL_BILL, 0);
        });
    });
});
