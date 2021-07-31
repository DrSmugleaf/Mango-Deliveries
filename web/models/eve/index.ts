import { Sequelize } from "sequelize/types"
import * as alliance from "./alliance.js"
import * as character from "./character.js"
import * as contract from "./contract.js"
import * as corporation from "./corporation.js"
import * as destinations from "./destinations.js"
import * as invmarketgroups from "./invmarketgroups.js"
import * as invtypes from "./invtypes.js"
import * as invvolumes from "./invvolumes.js"
import * as settings from "./settings.js"

export { alliance, character, contract, corporation, destinations, invmarketgroups, invtypes, invvolumes, settings }

import * as models from "./index.js"

export function init(db: Sequelize): void {
  for (const model of Object.values(models)) {
    if ("init" in model) {
      model.init(db)
    }
  }
}