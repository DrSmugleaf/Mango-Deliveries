//
// Copyright (c) 2017 DrSmugleaf
//

import Sequelize from "sequelize"

class AllowedCorporations extends Sequelize.Model {}

export function init(db) {
  console.log("Initializing corporations")

  AllowedCorporations.init({
    name: {
      type: Sequelize.STRING(32),
      primaryKey: true
    }
  }, {
    sequelize: db
  })
}

export function allow(name) {
  AllowedCorporations.build({ name: name }).save()
}

export function disallow(name) {
  AllowedCorporations.build({ name: name }).destroy()
}

export function getAllowed() {
  return AllowedCorporations.findAll()
}

export async function isAllowed(name) {
  return AllowedCorporations.findOne({ where: { name: name } }).then(c => c !== null)
}
