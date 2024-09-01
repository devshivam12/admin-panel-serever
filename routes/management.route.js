import express from "express";
import { getAdmin, getAffiliateStat } from "../controller/management.controller.js";

const router = express.Router()

router.get('/admins', getAdmin)
router.get('/affiliate/:id', getAffiliateStat)

export default router;