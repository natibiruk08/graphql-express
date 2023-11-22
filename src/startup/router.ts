import { Express, Request, Response } from "express";

import { graphQLMiddleware } from "../graphql";

const routerSetup = (app: Express) => app.use("/graphql", graphQLMiddleware);

export default routerSetup;
