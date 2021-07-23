import { DataTypes, Model, Sequelize } from "sequelize"

interface AllowedAlliancesAttributes {
  name: string
}

class AllowedAlliances extends Model<AllowedAlliancesAttributes> implements AllowedAlliancesAttributes {
  name: string
}

export function init(db: Sequelize): void {
  console.log("Initializing alliances")

  AllowedAlliances.init({
    name: {
      type: DataTypes.STRING(32),
      primaryKey: true
    }
  }, {
    sequelize: db
  })
}

export function allow(name: string): Promise<AllowedAlliances> {
  return AllowedAlliances.build({ name: name }).save()
}

export function disallow(name: string): Promise<void> {
  return AllowedAlliances.build({ name: name }).destroy()
}

export function getAllowed(): Promise<AllowedAlliances[]> {
  return AllowedAlliances.findAll()
}

export function isAllowed(name: string): Promise<boolean> {
  return AllowedAlliances.findByPk(name).then(c => c !== null)
}
