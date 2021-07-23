import { Router } from "express"
import { router as eveRouter, init as eveInit } from "./eve.js"

export let router: Router

export function init(): void {
  eveInit()

  router = Router()

  router.use("/", eveRouter)

  router.get("*", function(req, res) {
    res.render("pages/404")
  })
}
