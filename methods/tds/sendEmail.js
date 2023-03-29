module.exports = {
    name: "Send Email",
    description: "",
    method: "post",
    execute(app, mysql, bcrypt, passwords){

        const nodemailer = require('nodemailer')

        app.get('/email', (req, res)=>{

            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: "no-reply@damocles.ca",
                    pass: passwords['email']
                }
            })

            transporter.sendMail({
                from: "no-reply@damocles.ca",
                to: "admin@damocles.ca",
                subject: "Testing email automation",
                text: "This is a test email sent from NodeJS"
            }).then(()=>{
                res.status(200)
                res.send("email sent")
            }).catch(err =>{
                res.status(500)
                res.send("Message failed")
            })

        })

    }
}