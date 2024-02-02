import express, { Request, Response } from "express";
import createError from "http-errors"
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import path from "path";

// Routes
import mainRoute from "./src/routes";
import authRoute from "./src/routes/auth";

dotenv.config();

const app = express();
const { PORT } = process.env;

// define middleware
app.use(morgan('dev'));
app.use(helmet.noSniff())

// urlencoded and json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// setup static file
app.use(express.static(path.join(__dirname, './public')));

// cors
const whiteLists = [
    'http://127.0.0.1:8080'
]
const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (whiteLists.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS!'))
        }
    }
}
app.use(cors(corsOptions))

// define routes
app.use('/api', mainRoute);
app.use('/auth', authRoute);

// Handle 404 error
app.use((req: Request, res: Response, next: Function) => {
    next(createError(404))
});

// listen port
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://127.0.0.1:${PORT}`)
})