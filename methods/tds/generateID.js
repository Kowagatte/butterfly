module.exports = {
    name: "GenerateID",
    description: "",
    method: "get",
    execute(app, mysql, bcrypt, passwords){
        app.get('/tds/generateID', (req, res)=>{

            function generateID() {
                function random() {
                    return Math.floor(Math.random() * 64)
                }
    
                var tempID = ""
    
                const baseChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '+', '-']
                const lenOfID = 8
    
                for(let i = 0; i<lenOfID; i++){
                    tempID += baseChars[random()]
                }

                return tempID
            }

            function checkForCollision(id){
                mysql.query(`select * from games where id=${mysql.escape(id)}`, (err, result)=>{
                    if(!err){
                        if(result.length == 0){
                            return false
                        }else{
                            // There is an ID collision. This should statistically never happen but, it could!
                            return true
                        }
                    }else{
                        res.status(500)
                        res.send("SQL query error")
                    }
                })
            }


            mysql.changeUser({database: "tds"}, (err)=>{
                if(!err){

                    // Constantly checks for collisions until a unique ID is found.
                    while (checkForCollision((id = generateID()))) {}

                    res.status(200)
                    res.send({"id": id})

                }else{
                    console.log("Failed to switch DBs")
                    res.status(500)
                    res.send("DB change failed.")
                }
            })

        })
    }
}