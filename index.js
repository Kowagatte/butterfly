// Main file for Butterfly

const fs = require('fs')
const cors = require('cors')
const passwords  = require('./passwords.json')
const express = require('express')
const mysql = require('mysql2')
const https = require('https')
const http = require('http')
const bcrypt = require("bcrypt")

const app = express()
app.use(cors())
app.use(express.json())

var options = {
    key: fs.readFileSync('damocles_ca.key'),
    cert: fs.readFileSync('api_damocles_ca.crt'),
    ca: [
        fs.readFileSync('api_damocles_ca.ca-bundle')
    ]
}

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

// Loads all method "modules" dynamically at runtime.


/**
 * Function: loadMethodFiles
 * @param {String} path: the path to directory containing Javascript files.
 * 
 * Loops through all files in directory and saves all *.js files to dictionary.
 */
function loadMethodFiles(path){
    const methodFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))
    const methods = {}
    
    for (const file of methodFiles){
        const method = require(`${path}${file}`)
        methods[method.name] = method
    }

    return methods
}

/**
 * Function: startMethods
 * @param {String} name: name of folder nested in "./methods/" containing Javascript files.
 * 
 * Loops through each Javascript file in the given directory and
 *  executes the "#execute" function inside them.
 */
function startMethods(name){
    Object.values(loadMethodFiles(`./methods/${name}/`)).forEach(value => {
        value.execute(app, mysqlCon, bcrypt, passwords)
    });
}

// -------------------------------------------------------------------------------------- //

// App Starting

// Connect to database.
mysqlCon.connect((err) =>{
    if(err) console.log("MYSQL did not connect!")
    else console.log("Connected to MYSQL")
})

// Keeps database connection alive.
function keep_alive(){
    mysqlCon.query("SELECT 'KEEP_ALIVE'", (err, result) =>{})
}
setInterval(keep_alive, 3600000)

// Loads all GET & POST methods.
startMethods('tds')
startMethods('damocles')

http.createServer(app).listen(80, ()=>{
    console.log(`HTTP Started on port 80`)
})
https.createServer(options, app).listen(443, ()=>{
    console.log(`HTTPS Started on port 443`)
})