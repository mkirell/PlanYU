import "dotenv/config";
import { Sequelize } from "sequelize";

const createSequelizeInstance = (dbName) =>
  new Sequelize(dbName, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: process.env.MYSQL_DIALECT,
    logging: false,
  });

const sequelize = createSequelizeInstance(process.env.MYSQL_DATABASE);

export async function createDB() {
  const tempSequelize = createSequelizeInstance("");
  await tempSequelize.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\`;`
  );
  await tempSequelize.close();
}

export default sequelize;
