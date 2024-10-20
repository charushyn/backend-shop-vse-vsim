import express from 'express'
import cors from 'cors'
import { configDotenv } from "dotenv";
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import path from 'path';

import crypto from 'crypto'



configDotenv();

// routes
import crmRoute from './routes/crm/index.js';
import authRouter from './routes/auth/index.js';
import excelRoute from './routes/excel/index.js';

const app = express()
app.use(cookieParser())
app.use(express.json())

 
app.use(cors({
  credentials: true,
  origin: [process.env.FRONTEND],
  optionsSuccessStatus: 200,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('', crmRoute)
app.use('', authRouter)
app.use('', excelRoute)


app.use('/images', express.static(`${path.resolve("")}/images`))

const PORT = process.env.PORT

app.listen(PORT, function () {
    console.log(`CORS-enabled web server listening on port ${PORT}`)
  })