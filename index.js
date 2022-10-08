require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const dns =  require('dns')
const urlparser = require('url-parse');
const short = require('shortid')

const {host} = require('./host')


// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

let cs = 'mongodb+srv://kassw:March@cluster0.ipvtxd6.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(cs).then(()=>{
  console.log('connected');
}).catch((error)=>{
  console.error(error);
})


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function insert(original,url,res){
  let m = new host({'original_url':original,'short_url': url })   
    m.save((err,data)=>{
      if(err) res.json({error: 'invalid url'})
      
      res.json({ 'original_url' : original, 'short_url' : data.short_url})
    });
}

function count(cb,original,res){
  let a = host.find().count(function (err, count) {
    if (err) res.json({error: 'invalid url'})  
    else {
      cb(original,parseInt(count),res)}
    });
}

app.post('/api/shorturl',(req,res)=>{  
  let url = req.body.url

  try{
  let u = new URL(url)
  dns.lookup(u.hostname,(error,address,family)=>{
    if(error){
      //res.json({ error: 'invalid url' }) 
    }else{
      let count = host.find().count()
    let a = host.find().count(function (err, count) {
      if (err) res.json({error: 'DB error'})  
      else {
        count +=count;
        let m = new host({'original_url':url,'short_url': count }) 
        m.save((err,data)=>{
          if(err){
            console.error(err);
          }
          res.json({ 'original_url' : url, 'short_url' : data.short_url})
        })  
      }
    
    })
    }
    }
  )}catch(err){
    res.json({'error': 'invalid url'})
  }
  })
  


  


app.get('/api/shorturl/:shortid',(req,res)=>{
  let shortId = req.params.shortid;
  host.findOne({'short_url': shortId},(err,data)=>{
    res.redirect(301,data.original_url)
  }) 

})  


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
