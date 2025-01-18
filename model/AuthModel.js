const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    email: String,
    password: String,
    number: String,

})

const AuthModel = mongoose.model("Auth", AuthSchema)
module.exports = AuthModel