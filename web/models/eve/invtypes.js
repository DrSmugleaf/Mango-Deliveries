import Sequelize from "sequelize"
import { readFileSync } from "fs"
import yamlParse from "yaml"

class InvTypes extends Sequelize.Model {}
class EveBannedTypes extends Sequelize.Model {}

export function initTable(model, tableName, db) {
  console.log(`Initializing ${tableName}`)

  model.init({
    itemId: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true
    },
    itemName: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  }, {
    sequelize: db,
    modelName: tableName
  })
}

export async function init(db) {
  initTable(InvTypes, "invtypes", db)
  initTable(EveBannedTypes, "eve_banned_types", db)
}

export async function parse() {
  const file = readFileSync("./sde/bsd/invNames.yaml", "utf8")
  const names = yamlParse(file)

  await InvTypes.bulkCreate(names)
}

export function allow(id) {
  EveBannedTypes.destroy({ where: { itemId: id } })
}

export function ban(data) {
  EveBannedTypes.build(data).save()
}

export function get(id) {
  return InvTypes.findByPk(id)
}

export function getBanned() {
  return EveBannedTypes.findAll()
}

export function getByName(name) {
  return InvTypes.findOne({ where: { itemName: name } })
}

export async function isIDBanned(id) {
  return EveBannedTypes.findByPk(id).then(t => t !== null)
}

export async function isNameBanned(name) {
  return EveBannedTypes.findOne({ where: { itemName: name } }).then(t => t !== null)
}
