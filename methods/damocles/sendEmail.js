module.exports = {
    name: "Send Email",
    description: "",
    method: "post",
    execute(app, mysql, bcrypt, passwords){

        const sendMail = require('../../gmail');

        app.post('/email', (req, res)=>{

            if(req.body['secret'] == passwords['secret']){
                const email = req.body['email']

                const options = {
                    to: email,
                    subject: 'This is a test',
                    text: 'This email is sent from the damocles API',
                    textEncoding: 'base64',
                }
    
                sendMail(options).then(()=>{
                    res.status(200)
                    res.send("email sent")
                }).catch(err=>{
                    res.status(500)
                    res.send(err)
                })

            }else{
                res.status(401)
                res.send("Secret Failed")
            }


        })

    }
}