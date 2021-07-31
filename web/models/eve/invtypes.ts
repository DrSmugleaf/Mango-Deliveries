import { DataTypes, Model, Sequelize } from "sequelize"
import { readFileSync } from "fs"
import yaml from "yaml"

export interface InvTypesAttributes {
  itemId: number,
  itemName: string
}

export class InvTypes extends Model<InvTypesAttributes> implements InvTypesAttributes {
  itemId!: number
  itemName!: string
}

export class EveBannedTypes extends Model<InvTypesAttributes> implements InvTypesAttributes {
  itemId!: number
  itemName!: string
}

function getTableDefinition() {
  return {
    itemId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    itemName: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }
}

export function init(db: Sequelize): void {
  console.log("Initializing invtypes")

  InvTypes.init(getTableDefinition(), {
    sequelize: db,
    tableName: "invtypes"
  })

  EveBannedTypes.init(getTableDefinition(), {
    sequelize: db,
    tableName: "eve_banned_types"
  })
}

export async function parse(): Promise<void> {
  const file = readFileSync("./sde/bsd/invNames.yaml", "utf8")
  const names = yaml.parse(file)

  await InvTypes.bulkCreate(names)
}

export function allow(id: number): Promise<number> {
  return EveBannedTypes.destroy({ where: { itemId: id } })
}

export function ban(data: InvTypesAttributes): Promise<EveBannedTypes> {
  return EveBannedTypes.build(data).save()
}

export function get(id: number): Promise<InvTypes | null> {
  return InvTypes.findByPk(id)
}

export function getBanned(): Promise<EveBannedTypes[]> {
  return EveBannedTypes.findAll()
}

export function getByName(name: string): Promise<InvTypes | null> {
  return InvTypes.findOne({ where: { itemName: name } })
}

export async function isIDBanned(id: number): Promise<boolean> {
  return EveBannedTypes.findByPk(id).then(t => t !== null)
}

export async function isNameBanned(name: string): Promise<boolean> {
  return EveBannedTypes.findOne({ where: { itemName: name } }).then(t => t !== null)
}
