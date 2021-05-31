const mongoose = require("mongoose")
const Schema = mongoose.Schema
const jobSchema = Schema({
    name:{
        type: String,
        requied: true
    },
    dailyHours:{
        type: Number,
        required: true
    },
    totalHours:{
        type: Number,
        required: true
    },
    daysToEnd:{
        type: Number,
        default: 1
    },
    price:{
        type: Number,
        default: 0
    },
    done:{
        type: Boolean,
        default: false
    }
    
},{timestamps:true})

module.exports = mongoose.model("job", jobSchema)