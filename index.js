// Main file for Butterfly

const fs = require('fs')
const passwords  = require('./passwords.json')
const express = require('express')
const mysql = require('mysql2')
const bcrypt = require("bcrypt")

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

app.listen(port, ()=>{
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

    console.log(`App Started on port ${port}`)
})