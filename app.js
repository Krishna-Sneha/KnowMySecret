require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://127.0.0.1:27017/secretDB"); 

console.log("secret is "+process.env.SECRET);

const secretSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

secretSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});

const Secret = mongoose.model("Secret", secretSchema);


app.get("/", (req, res)=>{
    res.render("home")
});

app.get("/login", (req, res)=>{
    res.render("login")
});

app.get("/register", (req, res)=>{
    res.render("register")
});

app.post("/register", (req, res)=>{
    const u = req.body.username;
    const p = req.body.password;

    const user1 = new Secret({
        email : u,
        password : p
    });
    user1.save();
    res.render("submit");
})

app.post("/login", (req, res)=>{
    const u = req.body.username;
    const p = req.body.password;

    Secret.findOne({email : u})
        .then((foundUser)=>{
            if(!foundUser)
            {
                res.redirect("/register");
            }
            else
            {
                if(foundUser.password === p)
                    res.render("secrets");
            }
        })
})

app.get("/submit", (req, res)=>{
    res.render("submit")
});



app.listen(3000, ()=>{
    console.log("App running on port 3000");
})