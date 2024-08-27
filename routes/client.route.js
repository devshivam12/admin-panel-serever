import express from 'express'
import { getCustomers, getLocations, getProducts, getTransactions } from '../controller/client.controller.js'

const router = express.Router()

router.get('/get-products', getProducts)
router.get('/get-customers', getCustomers)
router.get('/get-transactions', getTransactions)
router.get('/geography', getLocations)
export default router