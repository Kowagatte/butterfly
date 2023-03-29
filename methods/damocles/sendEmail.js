module.exports = {
    name: "Send Email",
    description: "",
    method: "post",
    execute(app, mysql, bcrypt, passwords){

        const sendMail = require('../../gmail');

        app.get('/email', (req, res)=>{

            const options = {
                to: 'admin@damocles.ca',
                //cc: 'cc1@example.com, cc2@example.com',
                //replyTo: 'amit@labnol.org',
                subject: 'This is a test',
                text: 'This email is sent from the damocles API',
                //html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
                //attachments: fileAttachments,
                textEncoding: 'base64',
                // headers: [
                //   { key: 'X-Application-Developer', value: 'Amit Agarwal' },
                //   { key: 'X-Application-Version', value: 'v1.0.0.2' },
                // ],
            }

            sendMail(options).then(()=>{
                res.status(200)
                res.send("email sent")
            }).catch(err=>{
                res.status(500)
                res.send(err)
            })


        })

    }
}