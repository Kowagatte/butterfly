module.exports = {
    name: "Account",
    description: "",
    method: "get",
    execute(app, mysql, bcrypt, passwords){
        app.get('/tds/account/*', (req, res)=>{
            var pathList = req.path.split('/').filter(Boolean)
            if(pathList.length == 3){
                var user = mysql.escape(pathList[2])
        
                mysql.changeUser({database: "tds"}, (err)=>{
                    if(err){
                        console.log("Failed to switch DBs")
                        res.status(500)
                        res.send("DB change failed")
                    }else{
                        mysql.query(`select * from accounts where username=${user}`, (err, result)=>{
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
    }
}