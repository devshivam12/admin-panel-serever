import Product from "../model/Product.js"
import ProductStat from "../model/ProductStats.js"
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
            .skip((page - 1) * limit)
            .limit(Number(limit))

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