import { config } from "dotenv"
config()

import { init } from "./db.js"
init()

import express, { Response, Request, NextFunction } from "express"
const app = express()

import helmet from "helmet"
import morgan from "morgan"
import { router, init as controllersInit } from "./controllers/index.js"
import cookieParser from "cookie-parser"
import { env } from "./env/index.js"
import session from "express-session"
import sequelizeSession from "connect-session-sequelize"
import { db } from "../web/db.js"
import { HTTPStatusCodes } from "./index.js"

app.use(cookieParser(env(process.env.EVE_DELIVERIES_SESSION_SECRET)))
app.use(helmet({
  contentSecurityPolicy: {
    reportOnly: true
  }
}))
app.set("trust proxy", 1)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

const SequelizeStore = sequelizeSession(session.Store)
const Store = new SequelizeStore({
  db: db
})

app.use(session({
  name: "mango deliveries",
  secret: env(process.env.EVE_DELIVERIES_SESSION_SECRET),
  store: Store,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV !== "dev", maxAge: 24 * 60 * 60 * 1000 }
}))

Store.sync()

controllersInit()
app.use(router)

app.locals.character = {}

if (process.env.NODE_ENV !== "dev") {
  app.use("*", function(e: Error, req: Request, res: Response, next: NextFunction) {
    console.error(e)
    res.sendStatus(HTTPStatusCodes.InternalServerError).redirect(`/${HTTPStatusCodes.InternalServerError}`)
    next()
  })
}

export default app