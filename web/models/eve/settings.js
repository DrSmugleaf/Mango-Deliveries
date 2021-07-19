//
// Copyright (c) 2017 DrSmugleaf
//

import Sequelize from "sequelize"

class Settings extends Sequelize.Model {}

export function init(db) {
  console.log("Initializing settings")

  Settings.init({
    maxVolume: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 300000
    }
  }, {
    sequelize: db
  })
}

export function get() {
  return Settings.findAll()
}

export function set(data) {
  return Settings.upsert(Settings.build(data))
}