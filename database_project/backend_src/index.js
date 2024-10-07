const express = require('express')

// Init express
const app = express();

// Create your endpoints/route handlers
app.get('/', function(req, res) {
    res.send('Hello, Express');
});

// Listen on a port
app.listen(8000);