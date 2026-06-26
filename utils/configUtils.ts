import * as dotenv from 'dotenv';
dotenv.config();

export class Config {
  // URL staging
  static get urlStaging(): string {
    return process.env.BASE_URL || '';
  }

  // Admin Account
  static get admin_username(): string {
    return process.env.ADMIN_USERNAME || '';
  }

  static get admin_password(): string {
    return process.env.ADMIN_PASSWORD || '';
  }

  // Manager Account
   static get manager_username(): string {
    return process.env.MANAGER_USERNAME || '';
  }

  static get manager_password(): string {
    return process.env.MANAGER_PASSWORD || '';
  }


  // Connect database
  static get db_host(): string {
    return process.env.DB_HOST || '';
  }

  static get db_port(): string {
    return process.env.DB_PORT || '';
  }

  static get db_name(): string {
    return process.env.DB_NAME || '';
  }

  static get db_user(): string {
    return process.env.DB_USER || '';
  }

  static get db_password(): string {
    return process.env.DB_PASSWORD || '';
  }
}

export default Config;