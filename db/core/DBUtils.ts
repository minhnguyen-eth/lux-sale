import { executeQuery } from './DBConnection';

// Check exists generalized
export async function checkExistsWithConditions(
    table: string,
    conditions: Record<string, { value: any; like?: boolean }>): Promise<boolean> {
    const keys = Object.keys(conditions);
    const whereClauses = keys.map(key =>
        conditions[key].like ? `${key} LIKE ?` : `${key} = ?`
    );
    const values = keys.map(key =>
        conditions[key].like ? `%${conditions[key].value}%` : conditions[key].value
    );

    const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${whereClauses.join(' AND ')}`;
    const result = await executeQuery(query, values);
    const count = (result as any[])[0].count;

    console.info(`Found ${count} records in ${table} with conditions:`, conditions);
    return count > 0;
}

// Clear full table or with condition
export async function clearTable(tableName: string, condition?: string): Promise<void> {
    const sql = condition
        ? `DELETE FROM ${tableName} WHERE ${condition}`
        : `TRUNCATE TABLE ${tableName}`;

    const result = await executeQuery(sql);

    if ('affectedRows' in result) {
        console.info(`Cleared ${result.affectedRows} rows in ${tableName} ${condition ? 'with condition' : ''}.`);
    } else {
        console.info(`Truncated table ${tableName}.`);
    }
}
