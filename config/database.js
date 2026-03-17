// C:\projetojsd\portalrccctba\config\database.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Carrega o .env corretamente (funciona em qualquer ambiente)
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

// DEBUG (pode remover depois)
console.log('DB CONFIG:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : undefined,
  database: process.env.DB_NAME,
});

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-03:00'
});

export default db;