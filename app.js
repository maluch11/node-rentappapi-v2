// =====================================================================
// get the packages we need ============================================
// =====================================================================
var express     = require('express');
var cors        = require('cors');
var app         = express();
var apiRoutes   = express.Router();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./controllers/user'); // get our user model
var Generic= require('./controllers/generic'); // get our user model

// =====================================================================
// configuration =======================================================
// =====================================================================
var port = process.env.PORT || config.port; // used to create, sign, and verify tokens
//mongoose.connect(config.database); // connect to database
// db connection created in controllers via require dbconnection.js file placed in modelsfolder

// app.set('superSecret', config.supersecret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.options('*', cors());

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Method");
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
//    // Website you wish to allow to connect
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
//
//    // Request methods you wish to allow
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//    // Request headers you wish to allow
//    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//    // Set to true if you need the website to include cookies in the requests sent
//    // to the API (e.g. in case you use sessions)
//    res.setHeader('Access-Control-Allow-Credentials', true);
//
//    // Pass to next layer of middleware
//    next();
    
    next();
});

// use morgan to log requests to the console
app.use(morgan('dev')); //todo change to production

// =====================================================================
// routes ==============================================================
// =====================================================================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at PORT:' + port + '/api');
});

// API ROUTES ==========================================================
//----------------------------------------------------------------------------------------
// API before authentication -------------------------------------------------------------
//----------------------------------------------------------------------------------------
// app.get('/users', (req, res) => User.getAllItems(req, res)); // working!; GET http://localhost:8080/users; files in controllers folder //only for test purpouses at the beginning

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to API!' });
});

// AUTHENTICATION - GET TOKEN (pass: login, password in the body of post message in application/x-www-form-urlencoded)
// http://localhost:3001/api/authenticate
// login:admin
// password:adminpassword
apiRoutes.post('/authenticate', (req, res) => User.postFindItemAndReturnToken(req, res));

//----------------------------------------------------------------------------------------
// API after authentication: token needed ------------------------------------------------
// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    
    // decode token
    if (token) {
        token.substring(0,7) === 'Bearer ' ? token = token.substring(7) : null; //consume Bearer token
        
        // verifies secret and checks exp
        jwt.verify(token, config.supersecret, function(err, decoded) {
            if (err) {
                return res.status(304).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});
//----------------------------------------------------------------------------------------
// API/CHECKTOKEN
apiRoutes.get('/checktoken', function(req, res) {
    res.json({
        success: true,
        message: 'Token valid',
    });
});

//----------------------------------------------------------------------------------------
//  API/TEST test API working with table TESTS on MYSQL
apiRoutes.get('/tests', (req, res) => Generic.getAllItems(req, res)); //SELECT ALL
apiRoutes.get('/test/:id', (req, res) => Generic.getItem(req, res)); //SELECT:id
apiRoutes.post('/test/:id', (req, res) => Generic.postItem(req, res)); //INSERT:id OR UPDATE:id (if exists) //fields and values in BODY
apiRoutes.post('/test', (req, res) => Generic.postItem(req, res)); //INSERT (Generated:id) //fields and values in BODY
apiRoutes.put('/test/:id/testname/:testname', (req, res) => Generic.putItem(req, res)); //UPDATE:id //fields and values in PATH

//  API/USER
// route to return all users (GET http://localhost:8080/api/users)
// apiRoutes.get('/users', (req, res) => User.getAllItems(req, res)); //working
apiRoutes.get('/user/:login', (req, res) => User.getItem(req, res)); //working
apiRoutes.post('/user', (req, res) => User.postItem(req, res));

// =====================================================================
// NEW API HERE     ====================================================
// =====================================================================
apiRoutes.post('/task', (req, res) => Generic.postItem(req, res)); //INSERT (Generated:id) //fields and values in BODY
apiRoutes.post('/task/:id', (req, res) => Generic.postItem(req, res)); //INSERT (Generated:id) //fields and values in BODY
apiRoutes.get('/tasks/:wherekey/:wherevalue', (req, res) => Generic.getItems(req, res)); //SELECT ALL where key:value


apiRoutes.get('/rentapp_rents', (req, res) => Generic.getAllItems(req, res)); //SELECT ALL czynsz
apiRoutes.get('/rentapp_rents/:wherekey/:wherevalue', (req, res) => Generic.getItems(req, res)); //SELECT ALL where key:value
apiRoutes.post('/rentapp_rent', (req, res) => Generic.postItem(req, res)); //INSERT (Generated:id) //fields and values in BODY
apiRoutes.post('/rentapp_rent/:id', (req, res) => Generic.postItem(req, res)); //UPDATE (:id) //fields and values in BODY


apiRoutes.get('/rentapp_reads', (req, res) => Generic.getAllItems(req, res)); //SELECT ALL odczyty
apiRoutes.get('/rentapp_reads/:wherekey/:wherevalue', (req, res) => Generic.getItems(req, res)); //SELECT ALL where key:value
apiRoutes.post('/rentapp_read', (req, res) => Generic.postItem(req, res)); //INSERT (Generated:id) //fields and values in BODY
apiRoutes.post('/rentapp_read/:id', (req, res) => Generic.postItem(req, res)); //UPDATE (:id) //fields and values in BODY

apiRoutes.get('/rentapp_water_prices', (req, res) => Generic.getAllItems(req, res)); //SELECT ALL odczyty
apiRoutes.get('/rentapp_water_prices/:wherekey/:wherevalue', (req, res) => Generic.getItems(req, res)); //SELECT ALL where key:value
apiRoutes.post('/rentapp_water_price', (req, res) => Generic.postItem(req, res)); //INSERT (Generated:id) //fields and values in BODY

apiRoutes.get('/rentapp_energy_prices', (req, res) => Generic.getAllItems(req, res)); //SELECT ALL odczyty
apiRoutes.get('/rentapp_energy_prices/:wherekey/:wherevalue', (req, res) => Generic.getItems(req, res)); //SELECT ALL where key:value
apiRoutes.post('/rentapp_energy_price', (req, res) => Generic.postItem(req, res)); //INSERT (Generated:id) //fields and values in BODY

apiRoutes.get('/rentapp_users_contexts/:wherekey/:wherevalue', (req, res) => Generic.getItems(req, res)); //SELECT ALL where key:value
apiRoutes.get('/rentapp_contexts/:wherekey/:wherevalue', (req, res) => Generic.getItems(req, res)); //SELECT ALL where key:value

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =====================================================================
// start the server ====================================================
// =====================================================================
app.listen(port);
console.log('Server listening at port:' + port);

