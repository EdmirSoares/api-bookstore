import { DataSource } from 'typeorm';
import { Loan } from '../entities/Loan';
import { Client } from '../entities/Client';
import { Book } from '../entities/Book';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Book, Client, Loan],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});