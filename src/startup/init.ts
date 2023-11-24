import { Express } from "express";
import dbConnection from "../database";

const appSetup = async (app: Express) => {
  try {
    await dbConnection.connect();

    console.log("Database connected successfully!");
    const APP_PORT = Number(process.env.APP_PORT) || 3000;

    app.listen(APP_PORT, () => {
      console.log(`Server started on port ${APP_PORT}`);
    });
  } catch (error) {
    console.log("Unable to start the app!");
    console.error(error);
  }
};

export default appSetup;
