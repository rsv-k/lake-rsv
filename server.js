const http = require('http');
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    console.log(Date.now() + ' Ping Recieved');
    res.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000);