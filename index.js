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

app.get('/', (req, res)=>{
    res.send("Hello World!")
})

app.post('/tds/createAccount/', (req, res)=>{
    if(req.body['secret'] == passwords['secret']){
        mysqlCon.changeUser({database: "tds"}, (err)=>{
            if(err){
                console.log("Failed to switch DBs")
                res.status(500)
                res.send("DB change failed")
            }else{
                const email = mysql.escape(req.body['email'])
                const username = mysql.escape(req.body['username'])

                mysqlCon.query(`select * from accounts where username=${username}`, (err, userResult)=>{
                    if(userResult.length > 0){
                        res.status(400)
                        res.send("Username is already taken.")
                    }else{
                        bcrypt.hash(req.body['password'], saltRounds, (err, hash)=>{
                            if(err){
                                res.status(500)
                            }else{
                                mysqlCon.query(`insert into logins values (${email}, '${hash}')`, (err, result)=>{
                                    if(err){
                                        res.status(400)
                                        if(err.code == "ER_DUP_ENTRY"){
                                            res.send("Email is already in use!")
                                        }else{
                                            res.send(err.code)
                                        }
                                    }else{
                                        mysqlCon.query(`insert into accounts values (${username}, ${email}, 1200, now())`, (err, result2)=>{
                                            if(result && result2){
                                                res.status(200)
                                                res.send("Account Created Succesfully!")
                                            }else{
                                                res.status(500)
                                                res.send("Something went wrong.")
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})

app.post('/tds/compare', (req, res)=>{
    if(req.body['secret'] == passwords['secret']){
        mysqlCon.changeUser({database: "tds"}, (err)=>{
            if(err){
                console.log("Failed to switch DBs")
                res.status(500)
                res.send("DB change failed")
            }else{
                const email = mysql.escape(req.body['email'])
                mysqlCon.query(`select * from logins where email=${email}`, (err, result)=>{
                    if(err){
                        res.status(500)
                        res.send("query error")
                    }else{
                        if(result.length == 0){
                            res.status(300)
                            res.send("Email does not exist")
                        }else{
                            bcrypt.compare(req.body['password'], result[0]['password'], (err, comp)=>{
                                if(comp){
                                    res.status(200)
                                    res.send("Logged in successfully")
                                }else{
                                    res.status(401)
                                    res.send("Incorrect Password.")
                                }
                            })
                        }
                    }
                })
            }
        })
    }
})

app.post('/tds/encrypt', (req, res)=>{
    const unencryptedPass = req.body['password']
    if(unencryptedPass != null || unencryptedPass != ""){
        bcrypt.hash(unencryptedPass, saltRounds, (err, hash)=>{
            if(err){
                res.status(500)
            }else{
                res.status(200)
                res.send(hash)
            }
        })
    }
})

app.post('/tds/login/*', (req, res)=>{
    if(req.body['secret'] == passwords['secret']){
        var pathList = req.path.split('/').filter(Boolean)
        if(pathList.length == 3){
            var email = mysql.escape(pathList[2])
    
            mysqlCon.changeUser({database: "tds"}, (err)=>{
                if(err){
                    console.log("Failed to switch DBs")
                    res.status(500)
                    res.send("DB change failed")
                }else{
                    mysqlCon.query(`select * from logins where email=${email}`, (err, result)=>{
                        if(err){
                            res.status(500)
                            res.send("query error")
                        }else{
                            res.status(200)
                            res.send(result)
                        }
                    })
                }
            })
        }else{
            res.status(400)
            res.send("improper path")
        }
    }else{
        res.status(401)
        res.send("Secret does not match.")
    }
})

app.get('/tds/account/*', (req, res)=>{
    var pathList = req.path.split('/').filter(Boolean)
    if(pathList.length == 3){
        var user = mysql.escape(pathList[2])

        mysqlCon.changeUser({database: "tds"}, (err)=>{
            if(err){
                console.log("Failed to switch DBs")
                res.status(500)
                res.send("DB change failed")
            }else{
                mysqlCon.query(`select * from accounts where username=${user}`, (err, result)=>{
                    if(err){
                        res.status(500)
                        res.send("query error")
                    }else{
                        res.status(200)
                        res.send(result)
                    }
                })
            }
        })
    }else{
        res.status(400)
        res.send("improper path")
    }
})

app.get('/damocles/blogs', (req, res) =>{
    mysqlCon.changeUser({database: "damocles"}, (err)=>{
        if (err){
            console.log("Failed to switch DBs")
            res.status(500)
            res.send("DB change failed")
        }else{
            mysqlCon.query("select * from blogs", (err, result)=>{
                if(err){
                    res.status(500)
                    res.send("query error")
                }else{
                    res.status(200)
                    res.send(result)
                }
            })
        }
    })
})

app.listen(port, ()=>{
    mysqlCon.connect((err) =>{
        if(err) console.log("MYSQL did not connect!")
        else console.log("Connected to MYSQL")
    })
    console.log(`App Started on port ${port}`)
})