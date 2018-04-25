var express = require('express');
var jwt = require('jsonwebtoken');

var app = express();
app.set('port', (process.env.PORT || 8080));

const secretkey = 'Hello World';

app.get('/', function (req, res) {
    res.send("Welcome to bgphs jwt API server");
 })

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/login', genToken, (req, res) => {
    
    // Mock User Info
    const user = {
        id: 1,
        username: req.username,
        access: 'basic user'
    }

    jwt.sign({user}, secretkey, (err, token) => {
        res.json({
            token
        });
    });
});

app.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, secretkey, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: "Auth and Post Successfully",
                authData
            });
        }
    });
});

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
}

// Generate Token based on User Credentials
function genToken(req, res, next) {
    // Get Basic Auth Header value
    const authHeader = req.headers['authorization'];

    if(typeof authHeader !== 'undefined') {
        // Split at the space
        const basic = authHeader.split(' ');
        // Get Base64 Basic Credentials
        const cred = Buffer.from(basic[1], 'base64').toString();
        // Split at the :
        const credArray = cred.split(':');
        // Get Username from array
        req.username = credArray[0];
        // Get Password from array
        req.password = credArray[1];

        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

var server = app.listen(app.get('port'), function () {
	
	var host = server.address().address
	var port = server.address().port
	console.log("JWT Auth Server listening on port %s", app.get('port'))
})