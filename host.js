const mongoose = require('mongoose')

let schema = new mongoose.Schema({    
    urlString:{type:String},
    shortUrl:{type:String}
})

let host = mongoose.model('url',schema)


module.exports= {'host':host}