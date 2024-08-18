import express from 'express'
import { getCustomers, getProducts } from '../controller/client.controller.js'

const router = express.Router()

router.get('/get-products', getProducts)
router.get('/get-customers', getCustomers)

export default router