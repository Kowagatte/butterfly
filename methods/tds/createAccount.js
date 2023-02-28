module.exports = {
    name: "Create Account",
    description: "Creates ",
    method: "post",
    execute(app, mysql, bcrypt, passwords){
        app.post('/tds/createAccount/', (req, res)=>{
            if(req.body['secret'] == passwords['secret']){
                mysql.changeUser({database: "tds"}, (err)=>{
                    if(err){
                        console.log("Failed to switch DBs")
                        res.status(500)
                        res.send("DB change failed")
                    }else{
                        const email = mysql.escape(req.body['email'])
                        const username = mysql.escape(req.body['username'])
        
                        mysql.query(`select * from accounts where username=${username}`, (err, userResult)=>{
                            if(userResult.length > 0){
                                res.status(400)
                                res.send("Username is already taken.")
                            }else{
                                bcrypt.hash(req.body['password'], 10, (err, hash)=>{
                                    if(err){
                                        res.status(500)
                                    }else{
                                        mysql.query(`insert into logins values (${email}, '${hash}')`, (err, result)=>{
                                            if(err){
                                                res.status(400)
                                                if(err.code == "ER_DUP_ENTRY"){
                                                    res.send("Email is already in use!")
                                                }else{
                                                    res.send(err.code)
                                                }
                                            }else{
                                                mysql.query(`insert into accounts values (${username}, ${email}, 1200, now())`, (err, result2)=>{
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
    }
}