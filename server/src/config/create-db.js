import "dotenv/config";
import { Sequelize } from "sequelize";

export async function createDB() {
  const tempSequelize = new Sequelize(
    "",
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      dialect: process.env.MYSQL_DIALECT,
      logging: false,
    }
  );

  try {
    await tempSequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\`;`
    );
  } finally {
    await tempSequelize.close();
  }
}
