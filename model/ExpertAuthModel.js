const mongoose = require('mongoose')

const ExpertAuthSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    email: String,
    password: String,
    number: String,

})

const ExpertAuthModel = mongoose.model("ExpertAuth", ExpertAuthSchema)
module.exports = ExpertAuthModel