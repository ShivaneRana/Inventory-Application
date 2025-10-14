#! /usr/bin/env node
const { Client } = require("pg");

const dotenv = require("dotenv");
const {argv} = require("node:process");
const path = require("node:path")

dotenv.config({path:path.resolve(__dirname,"../.env"),quiet:true});

if(argv[2] === 'dev'){
    console.log("populate developer database");

}else if(argv[2] === "prod"){
    console.log("populate production database");

}

let SQL = ``;

async function main(){

    const client = new Client({connectionString: "postgresql://localhost:5432/manga_db"});

    try{
        console.log("starting script........");
        await client.connect();
        await client.query(SQL);
        await client.end();
        console.log("done...........");

    }catch(err){
        console.error(err);
    }finally{
        client.end();
    }
}


module.exports = main;

