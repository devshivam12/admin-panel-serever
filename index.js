import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import clientRoute from './routes/client.route.js'
import managementRoute from './routes/management.route.js'
import salesRoute from './routes/sales.route.js'
import generalRoute from './routes/general.route.js'
import OverallStat from './model/OverviewStats.js'
import User from './model/User.js'
import { dataAffiliateStat, dataOverallStat, dataProduct, dataProductStat, dataTransaction, dataUser } from './data/index.js'
import Product from './model/Product.js'
import ProductStat from './model/ProductStats.js'
import Transactions from './model/Transactions.js'
import AffiliateStat from './model/AffiliateStat.js'



dotenv.config()

const app = express()
const MONGO_URL = process.env.MONGO_URL
const corsOrigin = {
    origin: process.env.FRONTEND_URL
}

// middleware

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOrigin))

// connections

const port = process.env.PORT || 9000;

// Routes 

app.use('/client', clientRoute)
app.use('/general', generalRoute)
app.use('/management', managementRoute)
app.use('/sales', salesRoute)

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Database is connected")

        app.listen(port, (req, res) => {
            console.log(`Server is running at the ${port}`)

            // User.insertMany(dataUser)

            // Product.insertMany(dataProduct)

            // ProductStat.insertMany(dataProductStat)

            // Transactions.insertMany(dataTransaction)

            // OverallStat.insertMany(dataOverallStat)

            // AffiliateStat.insertMany(dataAffiliateStat)
        })
    }).catch((error) => {
        console.log(error)
    })