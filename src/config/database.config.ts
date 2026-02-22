import { DataSource } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './env.config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_NAME,
  password: DB_PASSWORD,
  database: DB_NAME,

  synchronize: false,
  migrations: [__dirname + '/migration/**/*{.js,.ts}'],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
});
