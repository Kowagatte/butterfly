module.exports = {
    name: "Encrypt",
    description: "",
    method: "post",
    execute(app, mysql, bcrypt, passwords){
        app.post('/tds/encrypt', (req, res)=>{
            const unencryptedPass = req.body['password']
            if(unencryptedPass != null || unencryptedPass != ""){
                bcrypt.hash(unencryptedPass, 10, (err, hash)=>{
                    if(err){
                        res.status(500)
                    }else{
                        res.status(200)
                        res.send(hash)
                    }
                })
            }
        })
    }
}