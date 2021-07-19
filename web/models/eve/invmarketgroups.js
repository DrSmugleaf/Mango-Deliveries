import { whilst } from "async"
import fs from "fs"
import YAML from "yaml"
import Sequelize from "sequelize"

class InvMarketGroups extends Sequelize.Model {}
class EveBannedMarketGroups extends Sequelize.Model {}

export function initTable(model, tableName, db) {
  console.log(`Initializing ${tableName}`)

  model.init({
    marketGroupId: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true
    },
    marketGroupName: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    marketDescription: {
      type: Sequelize.STRING(512),
      allowNull: true
    },
    iconId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true
    }
  }, {
    sequelize: db,
    modelName: tableName
  })
}

export async function init(db) {
  initTable(InvMarketGroups, "invmarketgroups", db)
  initTable(EveBannedMarketGroups, "eve_banned_market_groups", db)
}

export async function parse(db) {
  // const file = fs.readFileSync("./sde/bsd/marketGroups.yaml", "utf8")
  // const names = YAML.parse(file)
  // const namesParsed = [] // TODO
  // for (let name of names) {
  //   namesParsed.push({
  //   })
  // }
}

export function allow(id) {
  EveBannedMarketGroups.destroy({ where: { marketGroupId: id } })
}

export function ban(data) {
  EveBannedMarketGroups.build(data).save()
}

export function get(id) {
  return InvMarketGroups.findByPk(id)
}

export function getBanned() {
  return EveBannedMarketGroups.findAll()
}

export function getByName(name) {
  return InvMarketGroups.findAll({ where: { marketGroupName: name } })
}

export function getAllParentsByID(parentGroupId) {
  const parents = [parentGroupId]

  return new Promise((resolve, reject) => {
    whilst(
      function () { return Boolean(parentGroupId) },
      async function () {
        const result = InvMarketGroups.findByPk(parentGroupId)
        parentGroupId = result[0].parentGroupID
        if (parentGroupId)
          parents.push(parentGroupId)
        return parents
      },
      function (e, result) {
        if (e) {
          error(e)
          reject(e)
        }
        resolve(result)
      }
    )
  })
}

export function getHighestParentID(id) {
  return new Promise((resolve, reject) => {
    InvMarketGroups.findByPk(id).then((result) => {
      var parent = result[0].parentGroupID
      whilst(
        function () { return parent },
        async function (callback) {
          result = InvMarketGroups.findByPk(parent)
          if (result)
            parent = result[0].parentGroupID
          callback(null, result)
        },
        function (e, result) {
          if (e) {
            error(e)
            reject(e)
          }
          resolve(result)
        }
      )
    })
  })
}

export async function isBanned(id) {
  return EveBannedMarketGroups.findByPk(id).then(g => g !== null)
}
