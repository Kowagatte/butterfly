module.exports = {
    name: "GenerateID",
    description: "",
    method: "get",
    execute(app, mysql, bcrypt, passwords){
        app.get('/tds/generateID', (req, res)=>{
            mysql.changeUser({database: "tds"}, (err)=>{
                if(err){
                    console.log("Failed to switch DBs")
                    res.status(500)
                    res.send("DB change failed")
                }else{

                    var tempID = ""

                    const baseChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '+', '-']
                    const lenOfID = 8

                    for(){
                        
                    }

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
        })
    }
}