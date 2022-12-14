//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const encrypt= require("mongoose-encryption");

const app = express();
const secret=process.env.SECRET; /* level up from security 2 */

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email: String,
  password:String
});


// var encKey = process.env.SOME_32BYTE_BASE64_STRING;
// var sigKey = process.env.SOME_64BYTE_BASE64_STRING;

userSchema.plugin(encrypt, { secret: secret,encryptedFields:["password"]});

const User = new mongoose.model('User', userSchema);



app.get("/", function(req,res){
    res.render("home.ejs");
});

app.get("/register", function(req,res){
    res.render("register.ejs");
});

app.post("/register", function(req,res){
  const newUser = new User({ 
    email:req.body.username, 
    password:req.body.password  
  });
  newUser.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets.ejs");
  }
  })
});


app.get("/login", function(req,res){
    res.render("login.ejs");
});

app.post("/login", function(req,res){

  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets.ejs")
        }else{
          console.log("incorrect password")
        }
      }
    }
  })

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
