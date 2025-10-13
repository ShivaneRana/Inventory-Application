#! /usr/bin/env node
const { Client } = require("pg");

const SQL = ``


async function main(){

    const client = new Client({connectionString: ""});

    try{
        console.log("starting script........");

        console.log("done...........");

    }catch(err){
        console.error(err);
    }finally{
        client.end();
    }
}

module.exports = main;

