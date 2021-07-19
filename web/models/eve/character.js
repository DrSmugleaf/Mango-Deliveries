//
// Copyright (c) 2017 DrSmugleaf
//

import Sequelize from "sequelize"

class EveCharacters extends Sequelize.Model {}
class EveBannedCharacters extends Sequelize.Model {}

export function init(db) {
  console.log("Initializing characters")

  EveCharacters.init({
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      primaryKey: true
    },
    token: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    characterName: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    characterPortrait: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    characterBirthday: {
      type: Sequelize.DATE,
      allowNull: false
    },
    corporationId: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    corporationName: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    corporationPortrait: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    allianceId: {
      type: Sequelize.BIGINT.UNSIGNED
    },
    allianceName: {
      type: Sequelize.TEXT("tiny")
    },
    alliancePortrait: {
      type: Sequelize.TEXT("tiny")
    },
    freighter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    director: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize: db
  })

  EveBannedCharacters.init({
    name: {
      type: Sequelize.STRING(32),
      primaryKey: true
    }
  }, {
    sequelize: db
  })
}

export function ban(name) {
  EveBannedCharacters.build({ name: name }).save()
}

export function remove(id) {
  EveCharacters.build({ id: id }).destroy()
}

export function get(id) {
  return EveCharacters.findByPk(id)
}

export function getBanned() {
  return EveBannedCharacters.findAll()
}

export function getByName(name) {
  return EveCharacters.findOne({ where: { name: name } })
}

export function getByToken(token) {
  return EveCharacters.findAll({ where: { token: token } })
}

export function getFreighters() {
  return EveCharacters.findAll({ where: { freighter: true } })
}

export async function isBanned(name) {
  return EveBannedCharacters.findByPk(name).then(c => c !== null)
}

export async function set(data) {
  await EveCharacters.upsert(data)
}

export function unban(name) {
  return EveBannedCharacters.build({ name: name }).destroy()
}
