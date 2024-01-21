import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import keys from "../config/keys";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

if(keys.NODE_ENV === 'Development') {
    app.use(morgan("dev"));
}

app.get("/", async (_: Request, res: Response) => {
    return res.status(200).send("Hi");
})

export default app;