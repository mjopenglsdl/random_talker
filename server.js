#!/usr/local/bin/node

const express = require('express');
const session = require("express-session");
const body_parser = require('body-parser');
const conf_manager = require('./lib/conf_manager');

// controllers
const talker_controller = require('./controller/talker_controller');
const user_controller = require('./controller/user_controller');


let app = express();

const PORT = 7777;

// set
app.set('view engine', 'pug');
app.set('views','./views');

// 
app.use("/public", express.static("public"));
// app.use("/node_modules", express.static("node_modules"));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(session({secret:"hola", resave:false, saveUninitialized:true}));


/// routes
app.use("/talker", talker_controller);
app.use("/user", user_controller);


// other
app.get("/", function(req, res){
    let b_logged_in = conf_manager.getConf().debug ? true : req.session.logged_in;
    res.render("index", {logged_in: b_logged_in});
});

app.get("/login", function(req, res){
    res.redirect("/user");
});


/// app
let server = app.listen(PORT, ()=>{
    console.log("server listening on: " + server.address().port);
});


module.exports = app;