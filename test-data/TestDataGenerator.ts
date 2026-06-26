export class TestDataGenerator {

    static getProductName() {
        return `Product${Math.floor(Math.random() * 100000)}`;
    }

    static getCustomerName() {
        return `Customer${Math.floor(100000 + Math.random() * 900000)}`;
    }
}