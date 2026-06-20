import path from "path";
import fs from "fs";
import { getConnection } from "../core/DBConnection";
import { clearTable } from "../core/DBUtils";

export async function clearRewardType() {
    await clearTable('reward_types', "name NOT LIKE '%Khen thưởng%'");
}

// import reward users from csv file

export async function importRewardUserFromCSV(fileName: string) {
  // resolve path từ project root
  const absPath = path.resolve(process.cwd(), 'test-data', fileName);
  console.log('Importing file from:', absPath);

  const sql = `
    LOAD DATA LOCAL INFILE '${absPath.replace(/\\/g, '/')}' 
    INTO TABLE reward_users
    FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
    LINES TERMINATED BY '\r\n'
    IGNORE 1 LINES
    (id, user_id, reward_type_id, name, description, date_awarded, note, value, status, 
    created_at, created_by, updated_at, updated_by, deleted_by, deleted_at) `;

  const conn = await getConnection();
  try {
    await conn.query({
      sql,
      infileStreamFactory: () => fs.createReadStream(absPath), 
    });
    console.log(` Imported reward user progress from ${absPath}`);
  } finally {
    await conn.end();
  }
}