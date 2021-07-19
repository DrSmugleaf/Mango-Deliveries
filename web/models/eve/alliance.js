//
// Copyright (c) 2017 DrSmugleaf
//

import Sequelize from "sequelize"

class AllowedAlliances extends Sequelize.Model {}

export function init(db) {
  console.log("Initializing alliances")

  AllowedAlliances.init({
    name: {
      type: Sequelize.STRING(32),
      primaryKey: true
    }
  }, {
    sequelize: db
  })
}

export function allow(name) {
  AllowedAlliances.build({ name: name }).save()
}

export function disallow(name) {
  AllowedAlliances.build({ name: name }).destroy()
}

export function getAllowed() {
  return AllowedAlliances.findAll()
}

export async function isAllowed(name) {
  return AllowedAlliances.findByPk(name).then(c => c !== null)
}
