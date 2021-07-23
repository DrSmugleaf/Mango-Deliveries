import { NextFunction, Request, Response } from "express"
import { getByToken } from "../models/eve/character.js"

export async function eveAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session.character && req.session.character.token) {
    req.session.character = await getByToken(req.session.character.token)
    next()
  } else {
    res.redirect("/login")
  }
}
