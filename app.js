require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(express.static('public'));
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
    console.log(req.body);
    let articles = []
    const reqStr = '/v2/' + req.body.contentType + '?' + req.body.q + req.body.from + req.body.to + req.body.country + req.body.category + req.body.language + req.body.page;
    console.log(reqStr);
    const options = {
        hostname: 'newsapi.org',
        path: reqStr,
        headers: {
            Authorization: process.env.API_KEY
        }
    }
    https.get(options, (resData) => {
        //data event emitted untill there is no consumeable data in read... stream
        resData.on('data', (data) => {
            articles.push(data);
        });
        //after run there is no consumeable data in read... stream
        resData.on('end', () => {
            //concat list of buffer objects into a single buffter object
            articles = Buffer.concat(articles);
            res.send(JSON.parse(articles))
        })

        // console.log(JSON.parse(articles));
    });
});


app.listen(3000, () => {
    console.log('server is listening at port 3000');
})