const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({extended:false}));
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/api/guardian', require('./src/routes/guardian'));
app.use('/api/nytimes', require('./src/routes/ny'));
app.use('/api/all', require('./src/routes/all'));

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});
