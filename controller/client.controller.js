import Product from "../model/Product.js"
import ProductStat from "../model/ProductStats.js"
import Transactions from "../model/Transactions.js"
import User from '../model/User.js'

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
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
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const searchCriteria = {
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
        { products : {
          $elemMatch : {
            name :{$regex: new RegExp(search, "i")}
          }
        }}
      ],
    }

    const transactions = await Transactions.find(searchCriteria)
      .sort(sortFormatted)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Transactions.countDocuments(searchCriteria);

    const transactionWithProducts = await Promise.all(
      transactions.map(async (transaction) => {
        const products = await Promise.all(
          transaction.products.map(async (productId) => {
            const product = await Product.findById(productId);
            return product;
          })
        );
        return { ...transaction._doc, products }
      })
    )

    res.status(200).json({
      transactionWithProducts,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
