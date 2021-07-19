import Sequelize from "sequelize"
import fs from "fs"
import YAML from "yaml"

class InvVolumes extends Sequelize.Model {}

export async function init(db) {
  console.log("Initializing invvolumes")

  InvVolumes.init({
    typeId: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true
    },
    volume: {
      type: Sequelize.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize: db
  })
}

export async function parse(db) {
  // TODO
  // const file = fs.readFileSync("./sde/bsd/typeIDs.yaml", "utf8")
  // const types = YAML.parse(file)
  // const typesParsed = [] // TODO
  // for (let type of types) {
  //   typesParsed.push({
  //   })
  // }
}

export function get(id) {
  return InvVolumes.findByPk(id)
}
