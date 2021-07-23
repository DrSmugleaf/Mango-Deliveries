import { DataTypes, Model, Sequelize, Optional, Op } from "sequelize"

interface EveContractsAttributes {
  id: number,
  link: string,
  destination: string,
  value: number,
  valueFormatted: string,
  valueShort: string,
  quote: number,
  quoteFormatted: string,
  quoteShort: string,
  volume: number,
  volumeFormatted: string,
  valueVolumeRatio: number,
  valueVolumeRatioFormatted: string,
  multiplier: number,
  submitterId: number,
  submitterName: string,
  submitted: number,
  submittedFormatted: string,
  status: string,
  freighterId?: number,
  freighterName?: string,
  taxed?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EveContractsCreationAttributes extends Optional<EveContractsAttributes, "id"> {}

class EveContracts extends Model<EveContractsAttributes, EveContractsCreationAttributes> implements EveContractsAttributes {
  id: number
  link: string
  destination: string
  value: number
  valueFormatted: string
  valueShort: string
  quote: number
  quoteFormatted: string
  quoteShort: string
  volume: number
  volumeFormatted: string
  valueVolumeRatio: number
  valueVolumeRatioFormatted: string
  multiplier: number
  submitterId: number
  submitterName: string
  submitted: number
  submittedFormatted: string
  status: string
  freighterId?: number
  freighterName?: string
  taxed?: boolean
}

export function init(db: Sequelize): void {
  console.log("Initializing contracts")

  EveContracts.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    link: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    destination: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    value: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    valueFormatted: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    valueShort: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    quote: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    quoteFormatted: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    quoteShort: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    volume: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    volumeFormatted: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    valueVolumeRatio: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    valueVolumeRatioFormatted: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    multiplier: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    submitterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    submitterName: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    submitted: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    submittedFormatted: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    status: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    freighterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    freighterName: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    taxed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize: db
  })
}

export function remove(id: number): Promise<void> {
  return EveContracts.findByPk(id).then(c => c?.destroy())
}

export function get(id: number): Promise<EveContracts | null> {
  return EveContracts.findByPk(id)
}

export function getAllPending(characterID?: number): Promise<EveContracts[]> {
  if (characterID) {
    return EveContracts.findAll({
      where: {
        [Op.and]: {
          [Op.or]: [
            { status: "pending" },
            { status: "flagged" }
          ],
          submitterId: characterID
        }
      },
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

export function getAllOngoing(characterID?: number): Promise<EveContracts[]> {
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

export function getAllFinalized(characterID?: number): Promise<EveContracts[]> {
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

export function getAllUntaxed(characterID: number): Promise<EveContracts[]> {
  if (characterID) {
    return EveContracts.findAll({
      where: {
        [Op.and]: [
          Sequelize.or(
            { status: "completed" },
            { status: "ongoing" }
          ),
          { taxed: 0 },
          { submitterId: characterID }
        ]
      }
    })
  }

  return EveContracts.findAll({
    where: {
      [Op.and]: [
        Sequelize.or(
          { status: "completed" },
          { status: "ongoing" }
        ),
        { taxed: 0 }
      ]
    }
  })
}

export function set(data: EveContractsCreationAttributes): Promise<[EveContracts, boolean | null]> {
  return EveContracts.upsert(data)
}
