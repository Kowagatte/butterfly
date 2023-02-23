module.exports = {
    name: "Blogs",
    description: "",
    method: "get",
    execute(app, mysql, bcrypt, passwords){
        app.get('/damocles/blogs', (req, res) =>{
            mysql.changeUser({database: "damocles"}, (err)=>{
                if (err){
                    console.log("Failed to switch DBs")
                    res.status(500)
                    res.send("DB change failed")
                }else{
                    mysql.query("select * from blogs", (err, result)=>{
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
    }
}