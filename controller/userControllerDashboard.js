const UserModelDashboard = require("../model/userModelDashboard")
const { error, success } = require("../helper/baseResponse")
const bcrypt = require("bcrypt")

const register = async (req, res) => {

    try {
        const { password } = req.body
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        const newUser = new UserModelDashboard({ ...req.body, password: hashPassword })

        return res.status(201).json(
            success("User Created Successfully", newUser, 201)
        )
    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}


const userKYCRegistration = async (req, res) => {
    try {
        /*
        Validation 
        */
        const all = await UserModelDashboard.find()
        return res.status(201).json(
            success("User fetched Successfully", all, 201)
        )
    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}

const listUsers = async (req, res) => {
    try {
        const all = await UserModelDashboard.find()
        return res.status(201).json(
            success("User fetched Successfully", all, 201)
        )
    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}
const userById = async (req, res) => {
    try {
        const { isApproved, id, search } = req.query;
        if (search) {
            console.log(search, "search");
            const users = await UserModelDashboard.find({ username: { $regex: search, $options: 'i' } }, { username: 1 });
            return res.status(201).json(
                success("Search result", users, 201)
            )
        } else if (!isApproved) {
            const user = await UserModelDashboard.findById(id)
            return res.status(201).json(
                success("User fetched Successfully", user, 201)
            )
        } else {
            console.log("checking", isApproved);
            const user = await UserModelDashboard.findByIdAndUpdate(id, { isApproved }, { new: true })
            return res.status(201).json(
                success("User updated ", user, 201)
            )
        }
    } catch (err) {
        return res.status(500).json(error(err.message, 500))
    }
}
module.exports = {
    register,
    listUsers,
    userById,
    userKYCRegistration
};