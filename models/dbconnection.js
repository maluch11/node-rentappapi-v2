var mysql = require('mysql');
var config = require('../config'); // get our config file

var connection = mysql.createConnection({
    host     : config.mysqlhost,
    user     : config.mysqluser,
    password : config.decr(config.mysqlpassword),
    database : config.mysqldatabase,
    timezone : 'utc'
});

connection.connect(); // connect to database

module.exports = connection;