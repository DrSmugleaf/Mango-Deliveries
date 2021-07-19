import { config } from "dotenv"
config()

if (process.env.NODE_ENV === "dev") import("longjohn")

import { init } from "./db.js"
init()

import express, { json, urlencoded, static as serveStatic } from "express"
const app = express()
import helmet from "helmet"
import path from "path"
import morgan from "morgan"
import pug from "pug"
import { router, init as controllersInit } from "./controllers/index.js"

app.use(helmet({
  contentSecurityPolicy: {
    reportOnly: true
  }
}))
app.set("trust proxy", 1)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan("dev"))
app.engine("pug", pug.__express)
app.set("views", path.join(path.resolve() + "/web/views"))
app.set("view engine", "pug")
app.use(serveStatic(path.join(path.resolve() + "/web/public")))

controllersInit()
app.use(router)

app.locals.character = {}

if(process.env.NODE_ENV !== "dev") {
  app.use("*", function(e, req, res, next) {
    console.error(e)
    res.status(500).render("pages/500")
    next()
  })
}

export default app