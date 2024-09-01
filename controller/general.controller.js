import OverallStat from '../model/OverviewStats.js';
import Transactions from '../model/Transactions.js';
import User from '../model/User.js'

export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findById(id);

        res.status(200).json({ status: "success", data: result })
    } catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}


export const getDashboardStats = async (req, res) => {
    try {
        const currentMonth = "November"
        const currentYear = 2021
        const currentDay = "2021-11-15"

        const transactions = await Transactions.find().limit(50).sort({ createdOn: -1 })

        const overallStats = await OverallStat.find({ year: currentYear })

        const {
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory
        } = overallStats[0]

        const thisMonthStats = overallStats[0].monthlyData.find(({ month }) => {
            return month === currentMonth
        })

        const todayStats = overallStats[0].dailyData.find(({ date }) => {
            return date === currentDay
        })

        res.status(200).json({
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory,
            thisMonthStats,
            todayStats,
            transactions,
        }
        )
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}