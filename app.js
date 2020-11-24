//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// var encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields:['password'] });
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render('home');
});
app.get("/login", function(req, res){
    res.render('login');
});
app.get("/register", function(req, res){
    res.render('register');
});

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newuser = new User({
            email: req.body.username,
            password: hash
        });
        newuser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        })

    })
    
});
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}, function(err, founduser){
        if(err){
            console.log(err);
        }else{
            if(founduser){
                bcrypt.compare(req.body.password, founduser.password, function(err, result){
                    if(result===true){

                        res.render("secrets");
                    }
                })
               
                
            }
        }
    })
});

app.listen(3000, function(){
    console.log("Server started at port 3000");
});