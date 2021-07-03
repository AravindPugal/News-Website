require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { json } = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});





app.post('/', (req, res) => {
    console.log(req.body);
    const q = "q=" + req.body.contentKey + "&";
    const qInTitle = "qInTitle=" + req.body.titleKey + "&";
    const from = "from=" + req.body.startDate + "&";
    const to = "to=" + req.body.endDate + "&";
    const language = "language=" + req.body.language;
    const pathStr = "https://newsapi.org/v2/" + req.body.contentType + "?" + q + qInTitle + from + to + language;
    console.log(pathStr);
    const options = {
        headers: {
            Authorization: process.env.API_KEY
        }
    }
    let chunks = []
    https.get(pathStr, options, (resData) => {
        resData.on('data', (data) => {
            chunks.push(data);
        }).on('end', function () {
            let data = Buffer.concat(chunks);
            res.send(JSON.parse(data))
        });

    });
});






app.listen(3000, () => {
    console.log('server is listening at port 3000');
});