import path from "path";
import fs from "fs";
import { getConnection } from "../core/DBConnection";
import { clearTable } from "../core/DBUtils";
import { DbConstants } from "../DbConstants ";

//wri9dL1lss

export async function clearPurchaseTransaction() {
    await clearTable(
        'purchase_transactions',
        `created_by = '${DbConstants.USER_ID}'`);
}
