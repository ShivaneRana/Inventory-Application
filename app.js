const express = require("express");
const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({quiet:false,debug:true});
const app = express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.set(express.urlencoded({extended:true}));
app.set(express.static(path.join(__dirname,"public")));



app.get("/",(req,res) => {
    console.log("root route");
    res.status(200).send("root route has been reached");
});


const PORT = process.env.PORT;
app.listen(PORT,(err) => {
    if(err){
        console.error(err);
    }
    console.log(`http://localhost:${PORT}`);
})