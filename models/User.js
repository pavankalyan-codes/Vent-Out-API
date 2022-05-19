const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    _id:String,
    Vents:String
})
module.exports = mongoose.model('user',userSchema,'Users')