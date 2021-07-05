require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { count } = require('console');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
app.post('/', (req, res) => {
    console.log(req.body);
    let q = req.body.contentKey
    let from = req.body.startDate;
    let to = req.body.endDate;
    let category = "";
    let country = "";
    let language = "language=" + req.body.language;


    if (q !== '') {
        q = "q=" + q + "&";
    }
    if (from !== '') {
        from = "from=" + from + "&";
    }
    if (to !== '') {
        to = "to=" + to + "&";
    }

    if (req.body.country) {
        category = "category=" + req.body.country + "&"
    }
    if (req.body.category) {
        category = "category=" + req.body.category + "&"
    }

    const pathStr = "https://newsapi.org/v2/" + req.body.contentType + "" + "" + "?" + q + from + to + category + country + language;
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