const passwords  = require('./passwords.json')
const express = require('express')
const mysql = require('mysql2')

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