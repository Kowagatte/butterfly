const path = require('path');

module.exports = {
    name: "Blog",
    description: "",
    method: "get",
    execute(app, mysql, bcrypt, passwords){

        // const options = {
        //     root: path.join(__dirname)
        // };

        console.log(__dirname)

        app.get('/damocles/blog/*', (req, res) =>{
            var pathList = req.path.split('/').filter(Boolean)
            if(pathList.length == 3){
                var blogID = pathList[2]

                if(!/^[0-9]+$/.test(blogID)){
                    res.status(400)
                    res.send("Bad path.")
                }else{
                    res.sendFile(path.resolve(__dirname + `../../../blogs/${blogID}.md`), (err)=>{
                        if(err){
                            if(err.message.startsWith('ENOENT')){
                                res.status(404)
                                res.send("Blog not found.")
                            }else{
                                res.status(500)
                                res.send("Error occured")
                            }
                        }
                    })
                }

            }else{
                res.status(400)
                res.send("Bad path.")
            }
        })
    }
}