const express = require('express');
const app = express();
const mongoose = require('mongoose');
const shortid = require('shortid');
const shortUrl = require('./routes/shortUrl');

mongoose.connect('mongodb://localhost/url',{
    useNewUrlParser: true,useUnifiedTopology: true
})


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));


app.get('/', function(req, res){
    shortUrl.find({}).then(function(shortUrls){

        res.render('index',{shortUrls:shortUrls})
    })
})

app.post('/shortUrls', function(req, res){
     shortUrl.create({
        full:req.body.fullUrl
    }).then(function(){
        res.redirect("/")
    })
})


app.get('/:shortUrl',function(req, res){
    shortUrl.findOne({short:req.params.shortUrl})
    .then(function(shortUrl) {
        if(shortUrl === null){
            res.sendStatus(404);
        }
        else{
            shortUrl.clicks++;
            shortUrl.save()
            .then(function(){
                res.redirect(shortUrl.full)
            })
        }
    })
})
app.listen(process.env.PORT || 5000);