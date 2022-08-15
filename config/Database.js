import { Sequelize } from "sequelize";

const db = new Sequelize("alo_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
