//
// Copyright (c) 2017 DrSmugleaf
//

import { getByToken } from "../models/eve/character.js"

export async function eveAuth(req, res, next) {
  if (req.session.character && req.session.character.token) {
    const eveCharacter = await getByToken(req.session.character.token)
    req.session.character = eveCharacter[0]
    return next()
  } else {
    return res.redirect("/login")
  }
}
