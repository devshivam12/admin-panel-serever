import express from 'express'
import { getSales } from '../controller/sales.controller.js'

const router = express.Router()

router.get('/get-sales', getSales)

export default router