import User from '../model/User.js'

export const getUser = async (req,res) => {
    try {
        const {id} = req.params
        const result = await User.findById(id);

        res.status(200).json({status : "success", data : result})
    } catch (error) {
        res.status(401).json({success : false, message : error.message})
    }
}
