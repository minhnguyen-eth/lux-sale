import path from "path";
import fs from "fs";
import { getConnection } from "../core/DBConnection";
import { clearTable } from "../core/DBUtils";
import { DbConstants } from "../DbConstants ";

export async function clearProducts() {
    await clearTable(
        'products', 
        `created_by = '${DbConstants.USER_ID}'`);
}
