import Sequelize from "sequelize"

class EveContracts extends Sequelize.Model {}

export function init(db) {
  console.log("Initializing contracts")

  EveContracts.init({
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    link: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    destination: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    value: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    valueFormatted: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    valueShort: {
      type: Sequelize.TEXT("tinby"),
      allowNull: false
    },
    quote: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    quoteFormatted: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    quoteShort: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    volume: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    volumeFormatted: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    valueVolumeRatio: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    valueVolumeRatioFormatted: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    multiplier: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false
    },
    submitterId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    submitterName: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    submitted: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    submittedFormatted: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    status: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    freighterId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    freighterName: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    taxed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize: db
  })
}

export function remove(id) {
  return EveContracts.build({ id: id }).destroy()
}

export function get(id) {
  return EveContracts.findByPk(id)
}

export function getAllPending(characterID) {
  if (characterID) {
    return EveContracts.findAll({
      where: Sequelize.and(
        Sequelize.or(
          { status: "pending" },
          { status: "flagged" }
        ),
        { where: { submitterId: characterID } }
      ),
      order: [["status", "DESC"], "submitted"]
    })
  }

  return EveContracts.findAll({
    where: Sequelize.or(
      { status: "pending" },
      { status: "flagged" }
    ),
    order: [["status", "DESC"], "submitted"]
  })
}

export function getAllOngoing(characterID) {
  if (characterID) {
    return EveContracts.findAll({
      where: Sequelize.and(
        { status: "ongoing" },
        { submitterId: characterID }
      )
    })
  }

  return EveContracts.findAll({ where: { status: "ongoing" } })
}

export function getAllFinalized(characterID) {
  if (characterID) {
    return EveContracts.findAll({
      where: Sequelize.and(
        { status: "completed" },
        { submitterId: characterID }
      )
    })
  }

  return EveContracts.findAll({ where: { status: "completed" } })
}

export function getAllUntaxed(characterID) {
  if (characterID) {
    return EveContracts.findAll({
      where: Sequelize.and(
        Sequelize.or(
          { status: "completed" },
          { status: "ongoing" }
        ),
        { taxed: 0 },
        { submitterId: characterID }
      )
    })
  }

  return EveContracts.findAll({
    where: Sequelize.and(
      Sequelize.or(
        { status: "completed" },
        { status: "ongoing" }
      ),
      { taxed: 0 }
    )
  })
}

export function set(data) {
  return EveContracts.upsert(EveContracts.build(data))
}
