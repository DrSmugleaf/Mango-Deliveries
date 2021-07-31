import { DataTypes, Model, Sequelize } from "sequelize"

export interface EveDestinationsAttributes {
  name: string,
  image: string
}

export class EveDestinations extends Model<EveDestinationsAttributes> implements EveDestinationsAttributes {
  name!: string
  image!: string
}

export function init(db: Sequelize): void {
  console.log("Initializing destinations")

  EveDestinations.init({
    name: {
      type: DataTypes.STRING(32),
      primaryKey: true
    },
    image: {
      type: DataTypes.TEXT({
        length: "tiny"
      }),
      allowNull: false
    }
  }, {
    sequelize: db
  })
}

export function add(data: EveDestinationsAttributes): Promise<EveDestinations> {
  return EveDestinations.build(data).save()
}

export function get(name: string): Promise<EveDestinations | null> {
  return EveDestinations.findOne({ where: { name: name } })
}

export function getAll(): Promise<EveDestinations[]> {
  return EveDestinations.findAll()
}

export function remove(name: string): Promise<void> {
  return EveDestinations.findOne({ [name]: name }).then(d => d?.destroy())
}