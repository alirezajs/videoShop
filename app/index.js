const express = require('express');
const App = express();
const http = require("http");
const path = require("path");
var bodyParser = require('body-parser')
const cookieParsel = require('cookie-parser');
const validator = require("express-validator");
const sesstion = require("express-session");
const mongoStore = require("connect-mongo")(sesstion);
const mongoose = require("mongoose");
const flash = require("connect-flash");



module.exports = class Application {

    constructor() {

        this.SetUpExpress();
        // this.SetMongoConection();
        this.SetConfig();
    }


    SetMongoConection() {
             mongoose.Promise=global.Promise;
             mongoose.connect("mongodb://localhost/nodejscms")
    }



    /*
      Set All express setting such as listen
    */
    SetUpExpress() {
        const server = http.createServer(App);
        server.listen(3000, () => console.log("listening on http://localhost:3000/"))
    }


    /*
      Set All Important Confirg 
    */

    SetConfig() {

        App.use(express.static('public'));
        App.set("view engin", "ejs");
        //declear views folder
        App.set("views", path.resolve("./resource/views"));

        App.use(bodyParser.json());
        App.use(bodyParser.urlencoded({
            extended: true
        }));

        App.use(validator());


        // App.use(sesstion({
        //     secret: "mysecretcode",
        //     resave: true,
        //     saveUninitialized: true,
        //     store: new mongoStore({
        //         mongooseConection: mongoose.connection
        //     })
        // }));

        App.use(flash());

        App.use(cookieParsel("mysecretcode"));



    }

}