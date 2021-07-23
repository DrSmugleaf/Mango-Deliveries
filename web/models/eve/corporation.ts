import { DataTypes, Model, Sequelize } from "sequelize"

interface AllowedCorporationsAttributes {
  name: string
}

class AllowedCorporations extends Model<AllowedCorporationsAttributes> implements AllowedCorporationsAttributes {
  name: string
}

export function init(db: Sequelize): void {
  console.log("Initializing corporations")

  AllowedCorporations.init({
    name: {
      type: DataTypes.STRING(32),
      primaryKey: true
    }
  }, {
    sequelize: db
  })
}

export function allow(name: string): Promise<AllowedCorporations> {
  return AllowedCorporations.build({ name: name }).save()
}

export function disallow(name:string): Promise<void> {
  return AllowedCorporations.build({ name: name }).destroy()
}

export function getAllowed(): Promise<AllowedCorporations[]> {
  return AllowedCorporations.findAll()
}

export async function isAllowed(name: string): Promise<boolean> {
  return AllowedCorporations.findOne({ where: { name: name } }).then(c => c !== null)
}
