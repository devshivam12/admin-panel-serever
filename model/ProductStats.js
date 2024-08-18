import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
    {
        productId : String,
        yearlySalesTotal : Number,
        yearlyTotalSoldUnit : Number,
        year : Number,
        monthlyData : [
            {
                month : String,
                totalSales : Number,
                totalUnits : Number
            }
        ],
        dailtData : {
            data : String,
            totalSales : Number,
            totalUnits : Number
        }
    },
    {
        timestamps : true
    }
)

const ProductStat = mongoose.model("ProductStat", ProductSchema)

export default ProductStat