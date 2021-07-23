import { DataTypes, Model, Sequelize } from "sequelize"

interface InvMarketGroupsAttributes {
  marketGroupId: number,
  marketGroupName: string,
  description: string | null,
  iconId: number | null,
  parentGroupId: number | null
}

class InvMarketGroups extends Model<InvMarketGroupsAttributes> implements InvMarketGroupsAttributes {
  marketGroupId: number
  marketGroupName: string
  description: string | null
  iconId: number | null
  parentGroupId: number | null
}

class EveBannedMarketGroups extends Model<InvMarketGroupsAttributes> implements InvMarketGroupsAttributes {
  marketGroupId: number
  marketGroupName: string
  description: string | null
  iconId: number | null
  parentGroupId: number | null
}

function getTableDefinition() {
  return {
    marketGroupId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    marketGroupName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    iconId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    parentGroupId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  }
}

export function init(db: Sequelize): void {
  InvMarketGroups.init(getTableDefinition(), {
    sequelize: db,
    tableName: "invmarketgroups"
  })

  EveBannedMarketGroups.init(getTableDefinition(), {
    sequelize: db,
    tableName: "eve_banned_market_groups"
  })
}

export function allow(id: number): Promise<number> {
  return EveBannedMarketGroups.destroy({ where: { marketGroupId: id } })
}

export function ban(data: InvMarketGroupsAttributes): Promise<EveBannedMarketGroups> {
  return EveBannedMarketGroups.build(data).save()
}

export function get(id: number): Promise<InvMarketGroups | null> {
  return InvMarketGroups.findByPk(id)
}

export function getBanned(): Promise<EveBannedMarketGroups[]> {
  return EveBannedMarketGroups.findAll()
}

export function getByName(name: string): Promise<InvMarketGroups[]> {
  return InvMarketGroups.findAll({ where: { marketGroupName: name } })
}

export async function getAllParentsByID(parentGroupId: number): Promise<number[]> {
  const parents = [parentGroupId]
  let parent = parentGroupId

  while (parent !== null) {
    const result = await get(parent)

    if (result === null || result.parentGroupId === null) {
      break
    }

    parent = result.parentGroupId

    if (parent === null) {
      break
    }

    parents.push(parent)
  }

  return parents
}

export async function getHighestParentID(id: number): Promise<InvMarketGroups | null> {
  let result = await get(id)

  while (result !== null) {
    const parentId = result.parentGroupId

    if (parentId === null) {
      return result
    }

    const parent = await get(parentId)

    if (parent === null) {
      return result
    }

    result = parent
  }

  return null
}

export async function isBanned(id: number): Promise<boolean> {
  return EveBannedMarketGroups.findByPk(id).then(g => g !== null)
}
