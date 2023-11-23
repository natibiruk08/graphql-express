import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";

import appSetup from "./startup/init";
import routerSetup from "./startup/router";
import securitySetup from "./startup/security";
import errorMiddleware from "./middlewares/errorHandler";

dotenv.config();

const app = express();

appSetup(app);
securitySetup(app, express);
routerSetup(app);

app.use(errorMiddleware());
