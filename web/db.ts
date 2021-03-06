import { Sequelize } from "sequelize"
import { env } from "./env/index.js"
import * as models from "./models/eve/index.js"

export let db: Sequelize

export function init(): void {
  db = new Sequelize(env("MYSQL_DATABASE"), env("MYSQL_USER"), env("MYSQL_PASSWORD"), {
    host: env("MYSQL_HOST", "localhost"),
    port: parseInt(env("MYSQL_PORT", "3306"), 10),
    pool: {
      max: parseInt(env("MYSQL_CONNECTION_LIMIT", "10"), 10)
    },
    dialect: "mysql"
  })

  db.authenticate().then(() => {
    console.log("Database connection established.")
    db.sync()
    models.init(db)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
}