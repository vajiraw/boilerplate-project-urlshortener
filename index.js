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

app.post('/api/shorturl',(req,res)=>{  
  const url = req.body.url;
  if(url ===''){
    res.json({'error':'Invalid url'})
  }

  let ur = new URL(url)
  //console.log('ur : '+ur);
  
  let reg = /^https?:\/\//i  
  let mt = reg.test(url)
  console.log('m '+mt);

  let y = url.replace(reg,'')
  
  dns.lookup(y, (error, address, family) => { 
    if(error) res.json({ error: 'invalid url' })  
  
    // let n= short.generate();
    // console.log('short '+n);
    let n = Math.floor(1000 + Math.random() * 9000);
//console.log(val);
    
    let m = new host({'original_url':url,'short_url': n })   
    m.save((err,data)=>{
      if(err) console.error(err);
      console.log('data : '+data)
      res.json({ 'original_url' : url, 'short_url' : data.short_url})
    });

  });    

  })

app.get('/api/shorturl/:shortid',(req,res)=>{
  let shortId = req.params.shortid;
  host.findOne({'short_url': shortId},(err,data)=>{
    res.redirect(301,data.original_url)
  })
  
  //let digits = /^[0-9]*$/
  // if(digits.test(url)){
  //   //find in db and ope    
  // }
  //console.log('z: '+shortId);
  //host.find({'id': shortId})
  // host.findOne({shortUrl:shortId},(err,data)=>{
  //   if(err){
  //     console.log(err);
  //   }
  //   
  // })


})  


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
