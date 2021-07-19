//
// Copyright (c) 2017 DrSmugleaf
//

import Sequelize from "sequelize"

class EveDestinations extends Sequelize.Model {}

export async function init(db) {
  console.log("Initializing destinations")

  EveDestinations.init({
    name: {
      type: Sequelize.STRING(32),
      primaryKey: true
    },
    image: {
      type: Sequelize.TEXT({
        length: "tiny"
      }),
      allowNull: false
    }
  }, {
    sequelize: db
  })
}

export function add(data) {
  return EveDestinations.build(data).save()
}

export function get(name) {
  return EveDestinations.findOne({ where: { name: name } })
}

export function getAll() {
  return EveDestinations.findAll()
}

export function remove(name) {
  return EveDestinations.findOne({ name: name }).destroy()
}