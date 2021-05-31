const mongoose = require("mongoose")
const Schema = mongoose.Schema
const profileSchema = Schema({
    name:{
        type: String,
    },
    avatar:{
        type: String
    },
    monthGoal:{
        type: Number
    },
    hourDay:{
        type: Number
    },
    daysWeek:{
        type: Number
    },
    vacation:{
        type: Number
    },
    id:{
        type: Number,
        default: 1
    }
})


module.exports = mongoose.model("profile", profileSchema)