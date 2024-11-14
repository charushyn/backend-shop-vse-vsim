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
  if(req.method === "GET"){
    return true
  } else {
    return false
  }
}

const proxyMiddleware = createProxyMiddleware({
  target: `${process.env.CRM_URL}`,
  changeOrigin: true,
  pathFilter: proxyFilter,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.CRM_TOKEN}`)
      proxyReq.setHeader('Content-Type', 'application/json')
    }
  }
})

const crmRoute = express.Router()

crmRoute.use('/crm', proxyMiddleware)

export default crmRoute;