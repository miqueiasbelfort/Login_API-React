const router = require("express").Router()
const bcrypt = require("bcrypt")
require("dotenv").config()

// Models
const User = require("../models/User")

router.post("/register", async (req, res) => {
    
    const {name, email, password, confirmPassword} = req.body

    if(!name || !email || !password){
        res.status(422).json({menssage: "Por favor preencha todos os dados!"})
        return
    }

    if(password !== confirmPassword){
        res.status(422).json({menssage: "Senhas incorretas!"})
        return
    }


    const userEmail = await User.findOne({email: email})
    if(userEmail){
        res.status(422).json({menssage: "Usuário já cadastrado!"})
        return
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        
        const newUser = await user.save()

    } catch (error) {
        res.status(500).json({menssage: error})
    }

})

module.exports = router