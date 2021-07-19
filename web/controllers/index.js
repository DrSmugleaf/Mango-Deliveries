import { Router } from "express"
import { router as eveRouter, init as eveInit } from "./eve.js"

export var router

export function init() {
  eveInit()

  router = Router()

  router.use("/", eveRouter)

  router.get("*", function(req, res) {
    res.render("pages/404")
  })
}
