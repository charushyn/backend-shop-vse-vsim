import express from 'express'
import cookie from 'cookie'
import { configDotenv } from "dotenv";
import fs from 'fs'
import xlsx from 'node-xlsx'


import multer from "multer";


import { verifyRefreshTokenMiddleware } from '../auth/utils.js';

configDotenv();

const imageUploadPath = `${process.env.PATH_TO_IMAGES}`;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, imageUploadPath)
    },
    filename: function(req, file, cb) {
      cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
    }
  })



const imageUpload = multer({storage: storage})

const excelRoute = express.Router();
excelRoute.use(express.json())

excelRoute.get('/table', (req, res) => {
    const obj = xlsx.parse(`/Users/charushyn/Documents/GitHub/backend-shop-vse-vsim/data/test-excel.xlsx`)
    res.send(obj)
})

excelRoute.post('/table', verifyRefreshTokenMiddleware, async (req, res) => {
    const newFile = xlsx.build([{name: 'test-excel', data: req.body}])

    fs.unlinkSync('/Users/charushyn/Documents/GitHub/backend-shop-vse-vsim/data/test-excel.xlsx')
    fs.writeFileSync('/Users/charushyn/Documents/GitHub/backend-shop-vse-vsim/data/test-excel.xlsx', newFile)
    res.send(req.body)
})

excelRoute.post('/add-img', [verifyRefreshTokenMiddleware, imageUpload.single('file')], (req, res) => {
    res.send({src: `${process.env.BACKEND}/images/${req.file.filename}`})
})

excelRoute.post('/delete-img', [verifyRefreshTokenMiddleware, imageUpload.none()], (req, res) => {
    const filename = req.body.filename
    fs.unlinkSync(`${process.env.PATH_TO_IMAGES}/${filename}`)
    res.send('ok')
})

export default excelRoute;