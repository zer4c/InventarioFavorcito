import { DataSource, QueryRunner } from 'typeorm';
import {
  SERVER_PORT,
  DB_TEST_PORT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  NODE_ENV,
} from './env.config';
import 'reflect-metadata';

const isTest = NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: isTest ? Number(DB_TEST_PORT) : Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  synchronize: isTest,
  dropSchema: isTest,

  entities: ['src/modules/**/*.entities{.js,.ts}'],
  migrations: ['./migrations/**/*{.js,.ts}'],
  migrationsRun: !isTest,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
});
