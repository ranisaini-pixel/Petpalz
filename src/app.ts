import * as express from "express";
import { Application } from "express";
import userRoute from "./routes/userRoutes";
import * as dotenv from "dotenv";

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
  }

  private initializeRoutes(): void {
    this.app.use("/api/v1/users", userRoute);
  }
}
