const mongoose = require('mongoose')

let schema = new mongoose.Schema({    
    original_url :{type:String},
    short_url:{type:String}
})

let host = mongoose.model('url',schema)


module.exports= {'host':host}