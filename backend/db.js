import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:newpassword@localhost:5432/store_rating';

export const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
