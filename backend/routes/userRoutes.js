const router = require("express").Router()
const bcrypt = require("bcrypt")
require("dotenv").config()

// Models
const User = require("../models/User")

//helpers
const createUserToken = require("../helpers/create-user-token")
const getUserByToken = require("../helpers/get-user-by-token")
const getToken = require("../helpers/get-token")


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
        await createUserToken(newUser, req, res)

    } catch (error) {
        res.status(500).json({menssage: error})
    }

})
router.post("/login", async (req, res) => {
    const {email, password} = req.body

    if(!email){
        res.status((422)).json({message: "O email é obrigatório!"})
        return
    } else if (!password){
        res.status((422)).json({message: "A senha é obrigatória"})
        return
    }

    const user = await User.findOne({email: email})
    if(!user){
        res.status(422).json({
            message: "Usuário não existe!"
        })
        return
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
        res.status(422).json({message: "Senha invalida!"})
        return
    }
    
    await createUserToken(user, req, res)
})
router.get("/:id", async(req, res) => {
    const id = req.params.id
    const user = await User.findById(id).select("-password")

    if(!user){
        res.status(422).json({
            message: "Usuário não encontrado!"
        })
        return
    }
    res.status(200).json(user)
})
//edit user
router.patch("/edit", async (req, res) => {
    
    const token = getToken(req)
    const user = getUserByToken(token)

    /*const {email, password, name, confirmPassword} = req.body

    if(!name){
        return res.status(422).json({message: "O nome é obrigatório."})
    }

    user.name = name

    if(!email){
        return res.status(422).json({message: "O E-mail é obrigatório."})
    }
    user.email = email

    if(!password){
        return res.status(422).json({message: "A senha é obrigatório."})
    } else if (password == confirmPassword && password != null){
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)
        user.password = passwordHash
    }


    try {
        
        const updateUser = await User.findOneAndUpdate(
            {_id: user._id},
            {$set: user},
            {new: true}
        )
        res.status(200).json({message: "Usuário Atualizado.", updateUser})

    } catch (error) {
        res.status(500).json({message: error})
        return
    }*/

    res.json(user)


})

module.exports = router