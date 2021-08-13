import express, { Request, Response } from "express";
import setupRoutes from "../routes/index";
import logger from "./logger";

const app = express();

setupRoutes(app);

app.use(
  (
    err: { status?: Number; msg?: string; stack?: string },
    req: Request,
    res: Response,
    next: Function
  ) => {
    if (!err) {
      logger.error("Error handler reach without error.");
      return res
        .status(500)
        .send("An error has occurred on the server, please try again.");
    }

    logger.error(err);

    switch (err.status) {
      case 404:
        res.status(404).send();
        break;
      default:
        res
          .status(500)
          .send("An error has occurred on the server, please try again.");
    }
  }
);
export default app;
