const express = require("express")
const mongoose = require("mongoose")

require("dotenv").config()
const app = express()

// connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
})
    .then(() => console.log("Connection successfully"))
    .catch(err => console.log(err.mensage))


app.use(express.json())

//public
app.use(express.static('public'))

// import routes
const userRoutes = require("./routes/userRoutes")

// Routes
app.use("/api/user", userRoutes)

app.listen(process.env.PORT, () => {
    console.log("server runing!")
})