import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  flags: ['+LOCAL_FILES'],
};

export async function getConnection() {
  return await mysql.createConnection(config);
}

export async function executeQuery(sql: string, params: any[] = []): Promise<any> {
  const conn = await getConnection();
  try {
    const [result] = await conn.execute(sql, params);
    return result;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  } finally {
    await conn.end();
  }
}
