import * as express from "express";
import { Application } from "express";
import * as cookieparser from "cookie-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import path = require("path");
import routev1 from "./routes/routev1";

dotenv.config();

export class App {
  public app: Application;
  public port: string | number;
  public base_url: string;

  constructor(port: string | number, base_url: string) {
    this.app = express();
    this.port = port;
    this.base_url = base_url;
  }

  public async initialize(): Promise<void> {
    try {
      this.app.listen(this.port, () => {
        console.log(`🚀 Server is running on ${this.base_url}${this.port}`);
      });
    } catch (error) {
      console.log("Server Connection error:", error);
      process.exit();
    }

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "../uploads"))
    ); // Serve static files

    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );

    this.app.use(
      express.json({
        limit: "16kb",
      })
    );

    this.app.use(express.urlencoded({ extended: true, limit: "16kb" }));

    this.app.use(express.static("public"));
    this.app.use(cookieparser());
  }

  private initializeRoutes(): void {
    this.app.use("/api/v1", routev1);
  }
}
