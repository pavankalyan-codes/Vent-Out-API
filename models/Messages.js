const mongoose = require('mongoose')

const Schema = mongoose.Schema
const messagesSchema = new Schema({
    name:String,
    messages:[]
})
module.exports = mongoose.model('message',messagesSchema,'Messages')