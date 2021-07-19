import { forEach } from "underscore"
import path from "path"
import { Sequelize } from "sequelize"
import { readdirSync } from "fs";

export var db

export function init() {
  const normalizedPath = path.join(path.resolve(), "web/models/eve");
  const models = []

  readdirSync(normalizedPath).forEach(file => {
    models.push(import("./models/eve/" + file))
  });

  db = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    pool: {
      max: parseInt(process.env.MYSQL_CONNECTION_LIMIT, 10) || 10
    },
    dialect: "mysql"
  })

  db.authenticate().then(() => {
    console.log("Database connection established.")
    db.sync()

    // const doImport = true || argv._.includes("import") // TODO

    Promise.all(models).then(models => {
      forEach(models, async model => {
        model.init(db)

        // if (doImport && model.import !== undefined) { // TODO
        //   // await model.import(sequelize)
        // }
      })
    })
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
}