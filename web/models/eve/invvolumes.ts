import { DataTypes, Model, Sequelize } from "sequelize"

export interface InvVolumesAttributes {
  typeId: number,
  volume: string
}

class InvVolumes extends Model<InvVolumesAttributes> implements InvVolumesAttributes {
  typeId!: number
  volume!: string
}

export function init(db: Sequelize): void {
  console.log("Initializing invvolumes")

  InvVolumes.init({
    typeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    volume: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize: db
  })
}

export function get(id: number): Promise<InvVolumes | null> {
  return InvVolumes.findByPk(id)
}
