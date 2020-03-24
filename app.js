const express = require('express')
const exphbs  = require('express-handlebars');
const app = express()
const port = 3000

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.static('files'));

app.get('/', function (req, res) {    
    res.render('home', {layout: false});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});