import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import clientRoute from './routes/client.route.js'
import managementRoute from './routes/management.route.js'
import salesRoute from './routes/sales.route.js'
import generalRoute from './routes/general.route.js'
import User from './model/User.js'
import { dataProduct, dataProductStat, dataTransaction, dataUser } from './data/index.js'
import Product from './model/Product.js'
import ProductStat from './model/ProductStats.js'
import Transactions from './model/Transactions.js'


dotenv.config()

const app = express()

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

mongoose.connect("mongodb://127.0.0.1:27017/admin-panel")
    .then(() => {
        console.log("Database is connected")

        app.listen(port, (req, res) => {
            console.log(`Server is running at the ${port}`)

            // User.insertMany(dataUser)

            // Product.insertMany(dataProduct)

            // ProductStat.insertMany(dataProductStat)

            // Transactions.insertMany(dataTransaction)
        })
    }).catch((error) => {
        console.log(error)
    })