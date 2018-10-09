const morgan = require('morgan');
const express = require('express');
const sess = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":false}));

app.use(express.static(path.join(__dirname,'public')))

const db = require('./model/dbAccess');
const User = require('./model/User');

app.use(sess({
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.get('/',async function(req,res)
{
    if(req.session.user)
        res.render('home',{'user':req.session.user});
    else
        res.render('login');
    //db
/* 
    if(!req.session.userName && !req.session.visitCount)
    {
        req.session.userName='Kevin';
        req.session.visitCount=1;
        res.status(201).send(req.session);
    }
    else{
        req.session.visitCount+=1;
        res.status(200).send(req.session);
        resp.render('index',{'users':users});
    }*/
});

app.get('/home',function(req,res)
{
    if(req.session.user)
        res.render('home',{'user':req.session.user});
})

app.post('/home',async (req,res) =>
{
    //console.log(req.body.email,req.body.pass);     
    let t = await User.find({email:req.body.email,password:req.body.pass});
    if(t==undefined || t.length<1)
    {
        console.log('NOT FOUND');
        res.redirect('/');
    }
    else
    {
        console.log('FOUND USER');
        req.session.user={lname:t[0].lname,fname:t[0].fname};
        //console.log(req.session);
        res.render('home',{'user':req.session.user});
    }
})

app.get('/logoff',function(req,res)
{
    req.session.destroy(function()
    {
        console.log('USER LOGOUT')
    });
    res.redirect('/');
})

app.listen(3000,function()
{
    console.log('http://localhost:3000');
})