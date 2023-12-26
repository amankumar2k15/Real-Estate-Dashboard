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

module.exports = {
    register
};