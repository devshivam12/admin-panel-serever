import Product from "../model/Product.js"
import ProductStat from "../model/ProductStats.js"
import Transactions from "../model/Transactions.js"
import User from '../model/User.js'

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        console.log(products)
        const productStats = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({
                    productId: product._id
                })
                return {
                    ...product._doc,
                    stat
                }
            })
        )

        res.status(200).json({ success: true, data: productStats })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const customers = await User.find({ role: "user" })
            .select("-password")
            .skip(page * limit)
            .limit(limit)

        const totalCount = await User.countDocuments({ role: "user" })

        res.status(200).json({
            success: true,
            data: customers,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getTransactions = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query

        const generalSort = () => {
            const sortParsed = JSON.parse(sort)
            const sortFormatted = {
                [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
            };

            return sortFormatted
        }

        const sortFormatted = Boolean(sort) ? generalSort() : {}

        const transactions = await Transactions.find({
            $or: [
                { cost: { $regex: new RegExp(search, "i") } },
                { userId: { $regex: new RegExp(search, "i") } }
            ],
        })
            .sort(sortFormatted)
            .skip(page * pageSize)
            .limit(pageSize);

        const total = await Transactions.countDocuments({
            name: { $regex: search, $options: "i" }
        });

        res.status(200).json({
            success: true,
            transactions,
            total
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}