import { DataTypes, Model, Sequelize } from "sequelize"

export interface EveCharacterAttributes {
  id: number
  token: string
  characterName: string,
  characterPortrait: string,
  characterBirthday: string,
  corporationId: number,
  corporationName: string,
  corporationPortrait: string,
  allianceId: string | undefined,
  allianceName: string | undefined,
  alliancePortrait: string | undefined,
  freighter: boolean,
  director: boolean
}

export interface EveBannedCharacterAttributes {
  name: string
}

export class EveCharacters extends Model<EveCharacterAttributes> {
  id!: number
  token!: string
  characterName!: string
  characterPortrait!: string
  characterBirthday!: string
  corporationId!: number
  corporationName!: string
  corporationPortrait!: string
  allianceId!: string | undefined
  allianceName!: string | undefined
  alliancePortrait!: string | undefined
  freighter!: boolean
  director!: boolean
}

export class EveBannedCharacters extends Model<EveBannedCharacterAttributes> implements EveBannedCharacterAttributes {
  name!: string
}

export function init(db: Sequelize): void {
  console.log("Initializing characters")

  EveCharacters.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true
    },
    token: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    characterName: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    characterPortrait: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    characterBirthday: {
      type: DataTypes.DATE,
      allowNull: false
    },
    corporationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    corporationName: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    corporationPortrait: {
      type: DataTypes.TEXT({length: "tiny"}),
      allowNull: false
    },
    allianceId: {
      type: DataTypes.BIGINT.UNSIGNED
    },
    allianceName: {
      type: DataTypes.TEXT({length: "tiny"})
    },
    alliancePortrait: {
      type: DataTypes.TEXT({length: "tiny"})
    },
    freighter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    director: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize: db
  })

  EveBannedCharacters.init({
    name: {
      type: DataTypes.STRING(32),
      primaryKey: true
    }
  }, {
    sequelize: db
  })
}

export function ban(name: string): Promise<EveBannedCharacters> {
  return EveBannedCharacters.build({ name: name }).save()
}

export function remove(id: number): Promise<void> {
  return EveCharacters.findByPk(id).then(c => c?.destroy())
}

export function get(id: number): Promise<EveCharacters | null> {
  return EveCharacters.findByPk(id)
}

export function getBanned(): Promise<EveBannedCharacters[]> {
  return EveBannedCharacters.findAll()
}

export function getByName(name: string): Promise<EveCharacters | null> {
  return EveCharacters.findOne({ where: { [name]: name } })
}

export function getByToken(token: string): Promise<EveCharacters | null> {
  return EveCharacters.findOne({ where: { token: token } })
}

export function getFreighters(): Promise<EveCharacters[]> {
  return EveCharacters.findAll({ where: { freighter: true } })
}

export function isBanned(name: string): Promise<boolean> {
  return EveBannedCharacters.findByPk(name).then(c => c !== null)
}

export function set(data: EveCharacterAttributes): Promise<[EveCharacters, boolean | null]> {
  return EveCharacters.upsert(data)
}

export function unban(name: string): Promise<void> {
  return EveBannedCharacters.build({ name: name }).destroy()
}
