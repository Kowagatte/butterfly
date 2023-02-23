// Main file for Butterfly

const fs = require('fs')
const passwords  = require('./passwords.json')
const express = require('express')
const mysql = require('mysql2')
const bcrypt = require("bcrypt")
const saltRounds = 10

const app = express()
app.use(express.json())
const port = 8080

var mysqlCon = mysql.createConnection({
    host: "192.168.0.13",
    user: "viewer",
    password: passwords['database']
})

// -------------------------------------------------------------------------------------- //

// Root path method

app.get('/', (req, res)=>{
    res.send("TDS API")
})

// -------------------------------------------------------------------------------------- //

// TDS method construction

const tdsMethodFiles = fs.readdirSync('./methods/tds/').filter(file => file.endsWith('.js'))
const methods = {}

for (const file of tdsMethodFiles){
    const method = require(`./methods/tds/${file}`)
    methods[method.name] = method
}

// -------------------------------------------------------------------------------------- //

// App Starting

app.listen(port, ()=>{
    mysqlCon.connect((err) =>{
        if(err) console.log("MYSQL did not connect!")
        else console.log("Connected to MYSQL")
    })

    function keep_alive(){
        mysqlCon.query("SELECT 'KEEP_ALIVE'", (err, result) =>{})
    }
    setInterval(keep_alive, 3600000)

    Object.values(methods).forEach(value => {
        value.execute(app, mysqlCon, bcrypt, passwords)
    });

    console.log(`App Started on port ${port}`)
})