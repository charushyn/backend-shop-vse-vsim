import express from 'express'
import 'dotenv/config'
import { createProxyMiddleware } from 'http-proxy-middleware';

import { configDotenv } from "dotenv";

configDotenv();

const allowedEndPoints = [
  '/products/categories',
  '/products'
]

const proxyFilter = function(path, req){
  return req.method === 'GET' // && allowedEndPoints.includes(path)
}

const proxyMiddleware = createProxyMiddleware({
  target: `${process.env.CRM_URL}`,
  changeOrigin: true,
  pathFilter: proxyFilter,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.CRM_TOKEN}`)
    }
  }
})

const crmRoute = express.Router()

crmRoute.use('/crm', proxyMiddleware)

export default crmRoute;