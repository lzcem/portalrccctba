// C:\projetojsd\portalrccctba\config\database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/projetojsd/portalrccctba/.env' });

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '-03:00'
});

export default db;