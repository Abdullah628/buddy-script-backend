import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import passport, { session } from "passport";
import "./config/passport";
import expressSession from "express-session";
import { envVars } from "./config/env";
import notFound from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

import { router } from "./routes/index";


const app = express()

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))


app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: `Welcome to buddy script System Backend`
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app