import mongoose from 'mongoose'
import User from '../model/User.js'
import Transactions from '../model/Transactions.js'

export const getAdmin = async(req,res) => {
    try {
        const admin = await User.find({role : "admin"}).select("-password")

        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

export const getAffiliateStat = async (req,res) => {
    try {
        const {id} = req.params;

        const userWithStats = await User.aggregate([
            {
                $match : {_id : new mongoose.Types.ObjectId(id)}
            },
            {
                $lookup : {
                    from : "affiliatestats",
                    localField : "_id",
                    foreignField : 'userId',
                    as : "affiliateStats"
                }
            },
            {
                $unwind : "$affiliateStats"
            }
        ])

        const salesTransactions = await Promise.all(
            userWithStats[0].affiliateStats.affiliateSales.map((id) => {
                return Transactions.findById(id)
            })
        )

        const filterdSalesTransactions = salesTransactions.filter((transaction) => transaction !== null)

        res.status(200).json({
            success : true,
            user : userWithStats,
            sales : filterdSalesTransactions
        })

    } catch (error) {
        res.status(500).json({message : error.message})
    }
}