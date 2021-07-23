import { DataTypes, Model, Sequelize } from "sequelize"

export interface SettingsAttributes {
  maxVolume: number
}

class Settings extends Model<SettingsAttributes> implements SettingsAttributes {
  maxVolume: number
}

export function init(db: Sequelize): void {
  console.log("Initializing settings")

  Settings.init({
    maxVolume: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 300000
    }
  }, {
    sequelize: db
  })
}

export function get(): Promise<Settings | null> {
  return Settings.findOne()
}

export function set(data: SettingsAttributes): Promise<[Settings, boolean | null]> {
  return Settings.upsert(Settings.build(data))
}