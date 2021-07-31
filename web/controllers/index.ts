import { Router } from "express"
import { HTTPStatusCodes } from "web"
import { router as eveRouter, init as eveInit } from "./eve"

export let router: Router

export function init(): void {
  eveInit()

  router = Router()

  router.use("/", eveRouter)

  router.get("*", function(req, res) {
    res.sendStatus(HTTPStatusCodes.NotFound)
  })
}
