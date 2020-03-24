const express = require('express')
const exphbs  = require('express-handlebars');
const app = express();
const port = 3000;
const {MongoClient} = require('mongodb');
const randomstring = require("randomstring");

// Database
const MongoDB = {
    'url': process.env.DEBUG ? 'mongodb://127.0.0.1:27017': provess.env.MONGODB_URL,
    'database': 'kodigo-db',
    'collection': 'kodigo'
}

// Read json post data triggered by AJAX
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.static('files'));

app.get('/', function (req, res) {
    res.render('home', {layout: false});
});

app.get('/:key', function (req, res) {
    MongoClient.connect(MongoDB['url'], (err, client) => {
        const db = client.db(MongoDB['database']);
        const key = req.params.key;
        db.collection(MongoDB['collection']).findOne({key}).then((obj) =>{
            client.close();
            console.log(`[SUCCESS] ${obj} snippet found.`);
            res.render('home', {layout: false, ...obj});
        }).catch((error) => {
            console.log(`[ERROR] Finding snippet. ${error}`);
            res.send(false);
        });
    });
});

app.post('/save', (req, res) => {
    MongoClient.connect(MongoDB['url'], (err, client) => {
        const db = client.db(MongoDB['database']);
        const key = `${randomstring.generate(5)}.${req.body['language']}`;

        db.collection(MongoDB['collection']).insertOne({key, code: req.body['code']}).then((result) =>{
            client.close();
            console.log(`[SUCCESS] ${key} snippet created.`);
            res.send(key);
        }).catch((error) => {
            console.log(`[ERROR] Creating snippet. ${error}`);
            res.send(false);
        });
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});