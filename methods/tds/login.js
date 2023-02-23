module.exports = {
    name: "Login",
    description: "",
    method: "post",
    execute(app, mysql, bcrypt, passwords){
        app.post('/tds/login/*', (req, res)=>{
            if(req.body['secret'] == passwords['secret']){
                var pathList = req.path.split('/').filter(Boolean)
                if(pathList.length == 3){
                    var email = mysql.escape(pathList[2])
            
                    mysql.changeUser({database: "tds"}, (err)=>{
                        if(err){
                            console.log("Failed to switch DBs")
                            res.status(500)
                            res.send("DB change failed")
                        }else{
                            mysql.query(`select * from logins where email=${email}`, (err, result)=>{
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
    }
}