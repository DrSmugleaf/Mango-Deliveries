//
// Copyright (c) 2017 DrSmugleaf
//

import { forEach } from "underscore"
import { isAllowed as isAllianceAllowed, getAllowed as getAllowedAlliances } from "../models/eve/alliance.js"
import { set as setCharacter, get as getCharacter, isBanned, getByToken, getBanned, getFreighters } from "../models/eve/character.js"
import { set as setContract, getAllPending, getAllOngoing, getAllFinalized } from "../models/eve/contract.js"
import { isAllowed as isCorporationAllowed, getAllowed as getAllowedCorporations } from "../models/eve/corporation.js"
import { getAll } from "../models/eve/destinations.js"
import { eveAuth } from "../middlewares/eve.js"
import { validateAppraisal, nShortener, contracts as _contracts, director as _director } from "../helpers/eve.js"
import { Router } from "express"
import { getBanned as getBannedGroups } from "../models/eve/invmarketgroups.js"
import { getBanned as getBannedTypes } from "../models/eve/invtypes.js"
import moment from "moment-timezone"
import request from "request-promise"
import session, { Store as ExpressSession } from "express-session"
import sequelizeSession from "connect-session-sequelize"
import { db } from "../db.js"
import { get as getSettings } from "../models/eve/settings.js"
import crypto from "crypto"

export var router

export function init() {
  const SequelizeStore = sequelizeSession(ExpressSession)
  const Store = new SequelizeStore({
    db: db
  })

  router = Router()

  router.use(session({
    name: "mango deliveries",
    secret: process.env.EVE_DELIVERIES_SESSION_SECRET,
    store: Store,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV !== "dev", maxAge: 1800000 }
  }))

  Store.sync()

  router.get("/login", function(req, res) {
    const state = crypto.randomBytes(64).toString("hex")
    req.session.state = state
    res.redirect(`https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=${process.env.EVE_CALLBACK}&client_id=${process.env.EVE_ID}&state=${state}`)
  })

  router.get("/callback", function(req, res) {
    const sessionState = req.session.state
    delete req.session.state

    if(req.query.state !== sessionState) {
      return res.sendStatus(403)
    }

    var eveCharacter = {}
    request.post({
      headers: {
        "Authorization": `Basic ${new Buffer(`${process.env.EVE_ID}:${process.env.EVE_SECRET}`).toString("base64")}`
      },
      url: "https://login.eveonline.com/oauth/token",
      form: {
        "grant_type": "authorization_code",
        "code": req.query.code
      }
    }).then((body) => {
      body = JSON.parse(body)
      eveCharacter.token = body.access_token

      return request.get({
        headers: {
          "Authorization": `Bearer ${eveCharacter.token}`
        },
        url: "https://login.eveonline.com/oauth/verify"
      })
    }).then((body) => {
      body = JSON.parse(body)
      eveCharacter.id = body.CharacterID

      return Promise.all([
        request.get(`https://esi.evetech.net/latest/characters/${body.CharacterID}/`),
        request.get(`https://esi.evetech.net/latest/characters/${body.CharacterID}/portrait/`)
      ])
    }).then((bodies) => {
      forEach(bodies, (body, index) => {
        bodies[index] = JSON.parse(body)
      })
      eveCharacter.characterName = bodies[0].name
      eveCharacter.characterPortrait = bodies[1].px64x64.replace(/^http:\/\//i, "https://")
      eveCharacter.characterBirthday = moment(bodies[0].birthday).format("YYYY-MM-DD HH:mm:ss")
      eveCharacter.allianceId = bodies[0].alliance_id
      eveCharacter.corporationId = bodies[0].corporation_id

      if (eveCharacter.allianceId === undefined) {
        return Promise.all([
          request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/`),
          request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/icons/`)
        ])
      } else {
        return Promise.all([
          request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/`),
          request.get(`https://esi.evetech.net/latest/corporations/${eveCharacter.corporationId}/icons/`),
          request.get(`https://esi.evetech.net/latest/alliances/${eveCharacter.allianceId}/`),
          request.get(`https://esi.evetech.net/latest/alliances/${eveCharacter.allianceId}/icons/`)
        ])
      }
    }).then(async (bodies) => {
      forEach(bodies, (body, index) => {
        bodies[index] = JSON.parse(body)
      })

      eveCharacter.corporationName = bodies[0].name
      eveCharacter.corporationPortrait = bodies[1].px64x64.replace(/^http:\/\//i, "https://")

      if (bodies.length == 4) {
        eveCharacter.allianceName = bodies[2].alliance_name
        eveCharacter.alliancePortrait = bodies[3].px64x64.replace(/^http:\/\//i, "https://")
      }

      await setCharacter(eveCharacter)
      eveCharacter = await getCharacter(eveCharacter.id)

      const userBanned = await isBanned(eveCharacter.characterName)
      const allianceAllowed = eveCharacter.allianceName === undefined
        ? true
        : await isAllianceAllowed(eveCharacter.allianceName)
      const corporationAllowed = await isCorporationAllowed(eveCharacter.corporationName)
      const isDirector = eveCharacter.director
      const isFreighter = eveCharacter.freighter
      const isAllowed = !userBanned && (allianceAllowed[0] || corporationAllowed[0] || isDirector || isFreighter)

      if (!isAllowed) return res.render("pages/unauthorized")

      req.session.character = eveCharacter
      res.redirect("/")
    }).catch(e => {
      console.error(e)
      res.render("pages/404")
    })
  })

  router.get("/", async function(req, res) {
    res.render("pages/index", {
      character: req.session.character || {},
      destinations: await getAll(),
      title: "Home - Mango Deliveries",
      active: "Home"
    })
  })

  router.get("/query", async function(req, res) {
    if(req.session.eveToken) {
      const eveCharacter = await getByToken(req.session.eveToken)
      req.session.character = eveCharacter[0]
    }
    if(!req.session.character) return res.status(403).json({
      alert: "You need to login before submitting contracts."
    })

    const eveCharacter = req.session.character

    const userBanned = await isBanned(eveCharacter.character_name)
    const allianceAllowed = await isAllianceAllowed(eveCharacter.alliance_name)
    const corporationAllowed = await isCorporationAllowed(eveCharacter.corporation_name)
    const isDirector = eveCharacter.director
    const isFreighter = eveCharacter.freighter
    const isAllowed = !userBanned[0] && (allianceAllowed[0] || corporationAllowed[0] || isDirector || isFreighter)

    if(!isAllowed) return res.status(403).json({
      alert: "You aren't allowed to submit contracts. Either you have been banned, or your corporation isn't whitelisted."
    })

    const validate = await validateAppraisal(req.query)
    if(validate.invalid) return res.status(400).json(validate)
    const appraisal = validate
    const price = appraisal.totals.sell
    const multiplier = req.query.multiplier || 1

    return res.status(200).json({
      jita: (price * multiplier).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      jitaShort: nShortener(price * multiplier, 2),
      quote: (price * 1.13 * multiplier).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      quoteShort: nShortener(price * 1.13 * multiplier, 2)
    })
  })

  router.post("/submit", async function(req, res) {
    if(req.session.eveToken) {
      const eveCharacter = await getByToken(req.session.eveToken)
      req.session.character = eveCharacter[0]
    }
    if(!req.session.character) return res.status(403).json({
      alert: "You need to login before submitting contracts."
    })

    const eveCharacter = req.session.character

    const userBanned = await isBanned(eveCharacter.character_name)
    const allianceAllowed = await isAllianceAllowed(eveCharacter.alliance_name)
    const corporationAllowed = await isCorporationAllowed(eveCharacter.corporation_name)
    const isDirector = eveCharacter.director
    const isFreighter = eveCharacter.freighter
    const isAllowed = !userBanned[0] && (allianceAllowed[0] || corporationAllowed[0] || isDirector || isFreighter)

    if(!isAllowed) return res.status(403).json({
      alert: "You aren't allowed to submit contracts. Either you have been banned, or your corporation isn't whitelisted."
    })

    const validate = await validateAppraisal(req.body)
    if(validate.invalid) return res.status(400).json(validate)
    const appraisal = validate
    const link = req.body.link
    const destination = req.body.destination
    const price = appraisal.totals.sell
    const multiplier = req.body.multiplier || 1
    const volume = appraisal.totals.volume

    setContract({
      link: link,
      destination: destination,
      value: price * multiplier,
      value_formatted: (price * multiplier).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      value_short: nShortener(price * multiplier),
      quote: price * 1.13 * multiplier,
      quote_formatted: Math.round(price * 1.13 * multiplier).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      quote_short: nShortener(price * 1.13 * multiplier),
      volume: volume * multiplier,
      volume_formatted: (volume * multiplier).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      value_volume_ratio: Math.round(price / volume),
      value_volume_ratio_formatted: Math.round(price / volume).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      multiplier: multiplier,
      submitter_id: req.session.character.id,
      submitter_name: req.session.character.character_name,
      submitted: moment().unix(),
      submitted_formatted: moment().format("MMMM Do YYYY, HH:mm:ss"),
      status: "pending"
    })

    return res.status(200).json({
      alert: "Contract submitted. Click here to see it."
    })
  })

  router.get("/contracts", eveAuth, function(req, res) {
    var characterID
    var freighter = req.session.character.freighter || req.session.character.director
    if(!freighter) {
      characterID = req.session.character.id
    }

    Promise.all([
      getAllPending(characterID),
      getAllOngoing(characterID),
      getAllFinalized(characterID)
    ]).then((contracts) => {
      const pending = contracts[0]
      const ongoing = contracts[1]
      const finalized = contracts[2]

      res.render("pages/contracts", {
        character: req.session.character || {},
        pendingContracts: pending,
        ongoingContracts: ongoing,
        finalizedContracts: finalized,
        director: req.session.character.director,
        freighter: freighter,
        title: "Contracts - Mango Deliveries",
        active: "Contracts"
      })
    })
  })

  router.post("/contracts/submit", eveAuth, function(req, res) {
    const director = req.session.character.director
    const freighter = req.session.character.freighter
    if(!(director || freighter)) return res.sendStatus(403)
    if(req.body.tax && !director) return res.sendStatus(403)

    Promise.all([
      _contracts.accept(req),
      _contracts.flag(req),
      _contracts.complete(req),
      _contracts.tax(req)
    ]).then(() => {
      return res.sendStatus(200)
    }).catch((errorID) => {
      return res.status(403).json({
        alert: `Contract #${errorID} was modified by someone else. Please reload the page.`
      })
    })
  })

  router.get("/director", eveAuth, async function(req, res) {
    if(!req.session.character.director) return res.redirect("/eve/eve")

    const bannedUsers = await getBanned()
    const freighters = await getFreighters()
    const allowedAlliances = await getAllowedAlliances()
    const allowedCorporations = await getAllowedCorporations()
    const bannedItemTypes = await getBannedTypes()
    const bannedMarketGroups = await getBannedGroups()
    const eveSettings = await getSettings()
    res.render("pages/director", {
      character: req.session.character || {},
      title: "Director Panel - Mango Deliveries",
      active: "Director Panel",
      bannedUsers: bannedUsers,
      freighters: freighters,
      allowedAlliances: allowedAlliances,
      allowedCorporations: allowedCorporations,
      bannedItemTypes: bannedItemTypes,
      bannedMarketGroups: bannedMarketGroups,
      settings: eveSettings[0],
    })
  })

  router.post("/director/submit", eveAuth, async function(req, res) {
    if(!req.session.character.director) return res.sendStatus(403)

    var action = req.body.action
    var response
    if(req.body.user) response = await _director.freighter(req.body.user, action)
    if(req.body.freighter) response = await _director.freighter(req.body.freighter, action)
    if(req.body.alliance) response = await _director.alliance(req.body.alliance, action)
    if(req.body.corporation) response = await _director.corporation(req.body.corporation, action)
    if(req.body.item) response = await _director.itemType(req.body.item, action)
    if(req.body.group) response = await _director.marketGroup(req.body.group, action)
    if(req.body.object === "settings") response = await _director.settings(req.body)
    if(req.body.object === "destination") response = await _director.destination(req.body, action)

    if(!response) return res.sendStatus(400)
    if(response.error) return res.status(404).json({ alert: response.alert })
    return res.status(200).json(response)
  })
}
