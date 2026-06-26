import path from "path";
import fs from "fs";
import { getConnection } from "../core/DBConnection";
import { clearTable } from "../core/DBUtils";
import { DbConstants } from "../DbConstants ";

export async function clearOrders() {
    await clearTable(
        'orders', 
        `created_by = '${DbConstants.USER_ID}'`);
}
