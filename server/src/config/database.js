import "dotenv/config";
import { Sequelize } from "sequelize";

const createSequelizeInstance = (dbName) =>
  new Sequelize(dbName, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  });

const sequelize = createSequelizeInstance(process.env.DB_NAME);

export async function createDB() {
  const tempSequelize = createSequelizeInstance("");
  await tempSequelize.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
  );
  await tempSequelize.close();
}

export default sequelize;
