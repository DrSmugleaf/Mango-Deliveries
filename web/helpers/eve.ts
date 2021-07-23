import * as alliance from "../models/eve/alliance.js"
import * as character from "../models/eve/character.js"
import * as contract from "../models/eve/contract.js"
import * as corporations from "../models/eve/corporation.js"
import * as destinations from "../models/eve/destinations.js"
import * as invmarketgroups from "../models/eve/invmarketgroups.js"
import * as invtypes from "../models/eve/invtypes.js"
import * as invvolumes from "../models/eve/invvolumes.js"
import moment from "moment-timezone"
import request from "request-promise"
import * as settings from "../models/eve/settings.js"
import { parse } from "url"
import { isUri } from "valid-url"
import { ParsedQs } from "qs"
import { Alert, DirectorDestinationsBody, DirectorSettingsBody } from "../controllers/eve.js"
import { Request } from "express"

export interface AppraisalResponse {
  invalid: {
    ["#link"]?: string
    ["#multiplier"]?: string
    ["#destination"]?: string
  }
}

export interface AppraisalPrice {
  avg: number,
  max: number,
  median: number,
  min: number,
  percentile: number,
  stddev: number,
  volume: number,
  order_count: number
}

export interface AppraisalItem {
  name: string,
  typeID: number,
  typeName: string,
  typeVolume: number,
  quantity: number,
  prices: {
    all: AppraisalPrice,
    buy: AppraisalPrice,
    sell: AppraisalPrice,
    updated: string,
    strategy: string
  },
  meta: Record<string, unknown>
  volume?: number
}

export interface AppraisalJson {
  id: string,
  created: number,
  kind: string,
  market_name: string,
  totals: {
    buy: number,
    sell: number,
    volume: number
  },
  items: AppraisalItem[],
  raw: string,
  parser_lines: {
    contract: number[]
  },
  unparsed: Record<string, unknown>,
  private: boolean,
  price_percentage: number,
  live: boolean,
  expire_minutes: number
}

export function nShortener(num: number, digits = 2): string{
  const si = [
    { value: 1E18, symbol: "E" },
    { value: 1E15, symbol: "P" },
    { value: 1E12, symbol: "T" },
    { value: 1E9, symbol: "B" },
    { value: 1E6, symbol: "M" },
    { value: 1E3, symbol: "k" }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/

  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
    }
  }

  return num.toFixed(digits).replace(rx, "$1")
}

export async function validateAppraisal(query: ParsedQs): Promise<AppraisalResponse | AppraisalJson> {
  try {
    if (typeof query.link !== "string" || !isUri(query.link)) {
      return { invalid: { "#link": "Invalid link." } }
    }

    const link = query.link && typeof query.link === "string" ? parse(query.link) : null
    const multiplier = query.multiplier ? parseInt(query.multiplier.toString(), 10) : 1
    const destination = query.destination

    if (!link) {
      return { invalid: { "#link": "Invalid link." } }
    }

    if (link.hostname === null || !["evepraisal.com", "skyblade.de"].includes(link.hostname)) {
      return { invalid: { "#link": "Invalid link." } }
    }

    if (!multiplier) {
      return { invalid: { "#multiplier": "Invalid multiplier." } }
    }

    if (!destination) {
      return { invalid: { "#destination": "Invalid destination. Click one of the station images above." } }
    }

    const response: AppraisalResponse = { invalid: {} }
    const body = await request.get(`${link.href}.json`)
    const appraisal: AppraisalJson = JSON.parse(body)

    const promises = await Promise.all([
      filterBannedItemTypes(appraisal),
      filterBannedMarketGroups(appraisal),
      fixShipVolumes(appraisal)
    ])

    const bannedItemTypes = promises[0]
    const bannedMarketGroups = promises[1]

    let string
    if (moment().diff(moment.unix(appraisal.created), "days") > 2) {
      string = "Appraisals can't be more than 2 days old."
      response.invalid["#link"] = response.invalid["#link"]
        ? response.invalid["#link"].concat(string)
        : string
    }

    if (appraisal.market_name !== "Jita") {
      string = "Appraisal market must be Jita.\n"
      response.invalid["#link"] = response.invalid["#link"]
        ? response.invalid["#link"].concat(string)
        : string
    }

    if (appraisal.totals.volume * multiplier > 300000) {
      string = "Total cargo volume is over 300.000m³.\n"
      response.invalid["#link"] = response.invalid["#link"]
        ? response.invalid["#link"].concat(string)
        : string
    }

    if (bannedItemTypes && bannedItemTypes.length > 0) {
      string = "Your appraisal contains banned items:\n"

      for (const item of bannedItemTypes) {
        string = string.concat(`${item.itemName}\n`)
      }

      response.invalid["#link"] = response.invalid["#link"]
        ? response.invalid["#link"].concat(string)
        : string
    }

    if (bannedMarketGroups && bannedMarketGroups.length > 0) {
      string = "Your appraisal contains items from banned market groups:\n"

      for (const item of bannedMarketGroups) {
        string = string.concat(`${item.itemName}\n`)
      }

      response.invalid["#link"] = response.invalid["#link"]
        ? response.invalid["#link"].concat(string)
        : string
    }

    if (Object.keys(response.invalid).length === 0) {
      return appraisal
    }

    return response
  } catch {
    return { invalid: { "#link": "Invalid appraisal." } }
  }
}

export async function filterBannedItemTypes(appraisal: AppraisalJson): Promise<invtypes.InvTypes[]> {
  const bannedTypes = await invtypes.getBanned()
  const bannedTypeIDs = bannedTypes.map(t => t.itemId)
  const banned = []

  for (const item of appraisal.items) {
    const type = await invtypes.get(item.typeID)

    if (type !== null && bannedTypeIDs.includes(type.itemId)) {
      banned.push(type)
    }
  }

  return banned
}

export async function filterBannedMarketGroups(appraisal: AppraisalJson): Promise<invtypes.InvTypes[]> {
  const bannedMarketGroups = await invmarketgroups.getBanned()
  const bannedMarketGroupIDs = bannedMarketGroups.map(g => g.marketGroupId)
  const results = []

  for (const item of appraisal.items) {
    const type = await invtypes.get(item.typeID)

    if (type === null) {
      continue;
    }

    const groups = await invmarketgroups.getAllParentsByID(type.itemId)

    if (bannedMarketGroupIDs.some(id => groups.includes(id))) {
      results.push(type)
    }
  }

  return results
}

export async function fixShipVolumes(appraisal: AppraisalJson): Promise<void> {
  appraisal.totals.volume = 0

  for (const key in appraisal.items) {
    const item = appraisal.items[key]
    const invVolumesItem = await invvolumes.get(item.typeID)

    if (invVolumesItem === null || invVolumesItem.volume === null) {
      continue
    }

    const volume = parseInt(invVolumesItem.volume, 10)
    appraisal.items[key].volume = volume
    appraisal.totals.volume += volume
  }
}

export const contracts = {
  async accept(req: Request): Promise<void> {
    for (const id of req.body.accept) {
      const oldContract = await contract.get(id)

      if (!oldContract || !["pending", "flagged"].includes(oldContract.status)) {
        throw new Error(id)
      }

      oldContract.status = "ongoing"
      oldContract.freighterId = req.session.character?.id
      oldContract.freighterName = req.session.character?.characterName
      contract.set(oldContract)
    }
  },

  async flag(req: Request): Promise<void> {
    for (const id of req.body.flag) {
      const oldContract = await contract.get(id)

      if (!oldContract || oldContract.status !== "pending") {
        throw new Error(id)
      }

      oldContract.status = "flagged"
      contract.set(oldContract)
    }
  },

  async complete(req: Request): Promise<void> {
    for (const id of req.body.complete) {
      const oldContract = await contract.get(id)

      if (!oldContract || oldContract.status !== "ongoing") {
        throw new Error(id)
      }

      oldContract.status = "completed"
      contract.set(oldContract)
    }
  },

  async tax(req: Request): Promise<void> {
    for (const id of req.body.tax) {
      const oldContract = await contract.get(id)

      if (!oldContract || oldContract.status !== "completed" || oldContract.taxed) {
        throw new Error(id)
      }

      oldContract.taxed = true
      contract.set(oldContract)
    }
  }
}

export const director = {
  async user(name: string, action: string): Promise<Alert | false> {
    const banned = await character.isBanned(name)

    switch (action) {
    case "ban": {
      if (banned) {
        return { error: true, alert: `Character ${name} is already banned.` }
      }

      const user = await character.getByName(name)

      if (!user) {
        return { error: true, alert: `Character ${name} doesn't exist.` }
      }

      if (user.director) {
        return { error: true, alert: `You can't ban ${name}, he's a director.` }
      }

      character.ban(name)
      return { alert: `Banned character ${name}.` }
    }
    case "unban":
      if (!banned) {
        return { error: true, alert: `Character ${name} isn't banned.` }
      }

      character.unban(name)
      return { alert: `Unbanned character ${name}.` }
    default:
      return false
    }
  },

  async freighter(name: string, action: string): Promise<Alert | false> {
    const user = await character.getByName(name)

    if (!user) {
      return { error: true, alert: `Character ${name} doesn't exist.` }
    }

    switch (action) {
    case "add":
      if (user.freighter) {
        return { error: true, alert: `Character ${name} is already a freighter.` }
      }

      user.freighter = true
      character.set(user)
      return { alert: `Added ${name} to the list of freighters.` }
    case "remove":
      if (!user.freighter) {
        return { error: true, alert: `Character ${name} isn't a freighter.` }
      }

      user.freighter = false
      character.set(user)
      return { alert: `Removed ${name} from the list of freighters.` }
    default:
      return false
    }
  },

  async alliance(name: string, action: string): Promise<Alert | false> {
    const allowed = await alliance.isAllowed(name)

    switch (action) {
    case "allow":
      if (allowed) {
        return { error: true, alert: `Alliance ${name} is already whitelisted.` }
      }

      alliance.allow(name)
      return { alert: `Players in the alliance ${name} are now allowed to submit contracts.` }
    case "disallow":
      if (!allowed) {
        return { error: true, alert: `Alliance ${name} isn't whitelisted.` }
      }

      alliance.disallow(name)
      return { alert: `Players in the alliance ${name} are no longer allowed to submit contracts.` }
    default:
      return false
    }
  },

  async corporation(name: string, action: string): Promise<Alert | false> {
    const allowed = await corporations.isAllowed(name)

    switch (action) {
    case "allow":
      if (allowed) {
        return { error: true, alert: `Corporation ${name} is already whitelisted.` }
      }

      corporations.allow(name)
      return { alert: `Players in the corporation ${name} are now allowed to submit contracts.` }
    case "disallow":
      if (!allowed) {
        return { error: true, alert: `Corporation ${name} isn't whitelisted.` }
      }

      corporations.disallow(name)
      return { alert: `Players in the corporation ${name} are no longer allowed to submit contracts.` }
    default:
      return false
    }
  },

  async itemType(item: string | number, action: string): Promise<Alert | false> {
    const invItem = typeof item === "string" ? await invtypes.getByName(item) : await invtypes.get(item)

    if (!invItem) {
      return { error: true, alert: `Item type ${item} doesn't exist.` }
    }

    const banned = await invtypes.isIDBanned(invItem.itemId)

    switch (action) {
    case "ban":
      if (banned) {
        return { error: true, alert: `Item ${item} is already banned.` }
      }

      invtypes.ban(invItem)
      return { alert: `Banned item ${item} from appraisals.` }
    case "allow":
      if (!banned) {
        return { error: true, alert: `Item ${item} isn't banned.` }
      }

      invtypes.allow(invItem.itemId)
      return { alert: `Item ${item} is no longer banned from appraisals.` }
    default:
      return false
    }
  },

  async marketGroup(group: string | number, action: string): Promise<Alert | false> {
    const groups = typeof group === "string" ? await invmarketgroups.getByName(group) : await invmarketgroups.get(group)

    if (groups === null) {
      return { error: true, alert: `Market group ${group} doesn't exist.` }
    }

    if (Array.isArray(groups)) {
      let alert = "Multiple market groups exist with that name, please input an ID:\n"

      for (const group of groups) {
        alert = alert.concat(`${group.marketGroupId} ${group.marketGroupName}: ${group.description}\n`)
      }

      return { error: true, alert: alert }
    }

    const banned = await invmarketgroups.isBanned(groups.marketGroupId)

    switch (action) {
    case "ban":
      if (banned) {
        return { error: true, alert: `Market group ${group} is already banned.` }
      }

      invmarketgroups.ban(groups)
      return { alert: `Banned market group ${group} from appraisals.` }
    case "allow":
      if (!banned) {
        return { error: true, alert: `Market group ${group} isn't banned.` }
      }

      invmarketgroups.allow(groups.marketGroupId)
      return { alert: `Market group ${group} is no longer banned from appraisals.` }
    default:
      return false
    }
  },

  async settings(body: DirectorSettingsBody): Promise<Alert> {
    await settings.set({ "maxVolume": body.maxVolume })
    return { alert: "Settings updated." }
  },

  async destination(body: DirectorDestinationsBody, action: string): Promise<Alert | false> {
    const exists = await destinations.get(body.name) !== null

    switch (action) {
    case "add":
      if (exists) {
        return { error: true, alert: `Destination ${body.name} is already in the list.` }
      }

      destinations.add({ "name": body.name, "image": body.image }).catch((e) => console.error(e))
      return { alert: `Added ${body.name} to the list of destinations with image ${body.image}.` }
    case "remove":
      if (!exists) {
        return { error: true, alert: `Destination ${body.name} isn't on the list.` }
      }

      destinations.remove(body.name)
      return { alert: `Removed ${body.name} from the list of destinations.` }
    default:
      return false
    }
  }
}
