module.exports = {
    name: "Compare",
    description: "",
    method: "post",
    execute(app, mysql, bcrypt, passwords){
        app.post('/tds/compare', (req, res)=>{
            if(req.body['secret'] == passwords['secret']){
                mysql.changeUser({database: "tds"}, (err)=>{
                    if(err){
                        console.log("Failed to switch DBs")
                        res.status(500)
                        res.send("DB change failed")
                    }else{
                        const email = mysql.escape(req.body['email'])
                        mysql.query(`select * from logins where email=${email}`, (err, result)=>{
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
    }
}