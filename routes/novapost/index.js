import express from 'express'
import 'dotenv/config'
import { createProxyMiddleware } from 'http-proxy-middleware';

import { configDotenv } from "dotenv";

configDotenv();

const allowedEndPoints = []

const proxyFilter = function(path, req){
  // return req.method === 'GET' // && allowedEndPoints.includes(path)
}

const proxyMiddleware = createProxyMiddleware({
  target: `https://api.novaposhta.ua/v2.0/json/`,
  changeOrigin: true,
  // pathFilter: proxyFilter,
  on: {
    proxyReq: (proxyReq) => {
    //   proxyReq.setHeader('Authorization', `Bearer ${process.env.CRM_TOKEN}`)
    //   proxyReq.
    // console.log(proxyReq)
    }
  }
})

const npRoute = express.Router()

npRoute.use('/np', proxyMiddleware)

export default npRoute;