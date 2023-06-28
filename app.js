const express = require('express');
require('dotenv').config();
const app = express();
const port = 4000;

app.use( express.static('public'))

app.get('/', function (req, res)  {
    res.send('Hello, world');
})

app.listen( port, () =>{
    console.log(`listening on port ${port}`)
})