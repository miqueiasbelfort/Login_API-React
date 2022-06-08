require("dotenv").config()
const jwt = require("jsonwebtoken")

const createUserToken = async(user, req, res) => {
    //create the token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.JWT_KEY)

    //return the token create
    res.status(200).json({
        message: "Usuário aultenticado.",
        token: token,
        userId: user._id
    })
}

module.exports = createUserToken