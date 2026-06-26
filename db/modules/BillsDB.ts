import path from "path";
import fs from "fs";
import { getConnection } from "../core/DBConnection";
import { clearTable } from "../core/DBUtils";
import { DbConstants } from "../DbConstants ";

export async function clearBills() {
    await clearTable(
        'bills', 
        `created_by = '${DbConstants.USER_ID}'`);
}
