const express = require('express')

const app = express()
const port = 80

app.get('/', (req, res)=>{
    res.send("Hello World!")
})

app.listen(port, ()=>{
    console.log(`App Started on port ${port}`)
})