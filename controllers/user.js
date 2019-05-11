//include the model (aka DB connection)
let db = require('../models/dbconnection');
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens // https://github.com/auth0/node-jsonwebtoken
let config = require('../config');
let uniqueid = require('./uniqueid');
let sha = require('js-sha3').sha3_256;


//create class
let User = {
    //DEPRECATED, FORBIDDEN TO USE (but working)
    getAllItems: function (req, res) {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //query the DB using prepared statement
        var results = db.query('SELECT * from ??', [section], function (error, results, fields) {
            //if error, print blank results
            if (error) {
                // console.log(error);
                var apiResult = {};
                apiResult.meta = {
                    table: section,
                    type: "collection",
                    total: 0,
                    success: false
                };
                //create an empty data table
                apiResult.data = [];
        
                //send the results (apiResult) as JSON to Express (res)
                //Express uses res.json() to send JSON to client
                //you will see res.send() used for HTML
                res.json(apiResult);
        
            } else {
                //make results
                var resultJson = JSON.stringify(results);
                resultJson = JSON.parse(resultJson);
                var apiResult = {};
    
                // create a meta table to help apps
                //do we have results? what section? etc
                apiResult.meta = {
                    table: section,
                    type: "collection",
                    total: 1,
                    total_entries: 0,
                    success: true
                };
    
                //add our JSON results to the data table
                apiResult.data = resultJson;
    
                //send JSON to Express
                res.json(apiResult);
            }
        });
    }, //DEPRECATED
    
    //SELECT /user/:userlogin
    getItem: function (req, res) {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let table = pathname[1]+'s';
        let tablekey = pathname[1]+'login';
        let tablekeyvalue = pathname[2];

        // console.log(table);
        // console.log(tablekey);
        // console.log(tablekeyvalue);

        //query the DB using prepared statement
        var results = db.query('SELECT userid, userautoinc, username, isuseradmin from ?? where ?? = ?', [table, tablekey, tablekeyvalue], function (err, results, fields) {
            //if err, print blank results
            if (err){
                //err while update
                var apiResult = {};
                apiResult.meta = {
                    table: table,
                    operation: 'SELECT',
                    id: tablekeyvalue,
                    success: false,
                    err: err.message
                };
                apiResult.data = [];
                res.json(apiResult);
            } else {
                //make results
                var resultJson = JSON.stringify(results);
                resultJson = JSON.parse(resultJson);
                var apiResult = {};
                
                // create a meta table to help apps
                //do we have results? what section? etc
                apiResult.meta = {
                    table: table,
                    type: "collection",
                    total: 1,
                    total_entries: 0,
                    success: true
                };
    
                //add our JSON results to the data table
                apiResult.data = resultJson;
    
                //send JSON to Express
                res.json(apiResult);
            }
        });
    },
    
    //FIND USER return TOKEN (BODY PROCESSED: userlogin, userpassword)
    postFindItemAndReturnToken: function (req, res) {
        let section = 'users';
        let idfield = 'userlogin';
        if(req.body) {
            let id = req.body.login;
            let pass = sha(req.body.password);
    
            console.log('login:password = ' + req.body.login + ':' + req.body.password);
    
            // find the user
            var results = db.query('SELECT * from ?? where ?? = ? AND ?? = ?', [section, idfield, id, 'userpassword', pass], function (err, usr, fields) {
                if (err) {
                    console.log(err.message);
                } else {
                    if (!usr[0]) {
                        res.status(401).json({
                            success: false,
                            message: 'Authentication failed. User not found or wrong password.'
                        });
                    } else if (usr[0]) {
                        // check if password matches
                        if (usr[0].userpassword !== pass) {
                            res.status(401).json({
                                success: false,
                                token: null,
                                message: 'Authentication failed. User not found or wrong password.'
                            });
                        } else {
                            // if user is found and password is right
                            // create a token with only our given payload
                            // we don't want to pass in the entire user since that has the password
                            //todo add CLAIMS to PAYLOAD HERE (from DB)
                            const payload = {
                                isadmin: usr[0].isuseradmin,
                                ismanager: usr[0].isusermanager,
                                userid: usr[0].userid
                            };
                            let token = jwt.sign(payload, config.supersecret, {
                                expiresIn: config.tokenLifeTime // expires in 1 hours = 1440
                            });
                    
                            // return the information including token as JSON
                            res.json({
                                success: true,
                                message: 'Here U have token!',
                                token: token,
                                username: usr[0].username
                            });
                        }
                    }
                }
        
            });
        }
    },
    
    //INSERT /user/ (BODY PROCESSED)
    //UPDATE /user/ IF EXISTS (BODY PROCESSED)
    postItem: function (req, res) {
        let pathname = req._parsedUrl.pathname.split('/');
        let table = pathname[1]+'s';
        let tablekey = pathname[1]+'id';
        var tablekeyvalue = req.body.userid;
        let userid = req.body.userid;
        let userlogin = req.body.userlogin;
        let userpassword = req.body.userpassword;
        // if(userpassword != null) var userpasswordhash = sha(userpassword);
        // var newuserpassword = req.body.newpassword;
        // if(newuserpassword != null) var newuserpasswordhash = sha(newuserpassword);

        //CHECK TOKEN IF ADMIN REQUESTING; only admin can create new user
        var tokenPayloadDecoded = {};
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        jwt.verify(token, config.supersecret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                console.log(decoded); //todo delete
                tokenPayloadDecoded = decoded;
            }
        });

        var whereClauseFields = ['userid','userlogin','userpassword']; //fields in where clause

        //UPDATE: IF body userid, userlogin, userpassword then (if newuserpassword specified then password update performed)
        if (userid != null && userlogin != null && userpassword != null) {
            console.log("IF >> UPDATE");

            let sql = 'UPDATE ?? SET ';
            var prms = [table];

            //SET FIELDS TO UPDATE
            var iterations = 1;
            for (let key of Object.entries(req.body)) {
                if(!this.isInArray(key[0],whereClauseFields)) {
                    if(key[0] === 'isuseradmin'){ //isuseradmin can only be set by user with token (isadmin=1 in payload)
                        if (tokenPayloadDecoded.isadmin === 1)
                        sql += ' ?? = ? ,';
                        prms[prms.length] = key[0];
                        prms[prms.length] = req.body[key[0]];
                    }
                    else {
                        sql += ' ?? = ? ,';
                        prms[prms.length] = key[0] !== 'newuserpassword' ? key[0] : 'userpassword';
                        prms[prms.length] = key[0] !== 'newuserpassword' ? req.body[key[0]] : sha(req.body[key[0]]);
                    }
                    iterations++;
                    // console.log(key[0] + ':' + req.body[key[0]]);
                }
            }
            sql = sql.slice(0,-1); // removes last ','
            
            //SET FIELDS IN WHERE CLAUSE
            sql += 'WHERE ';
            for (let key of Object.entries(req.body)) {
                if(this.isInArray(key[0],whereClauseFields)) {
                    sql += ' ?? = ? AND';
                    prms[prms.length] = key[0];
                    prms[prms.length] = key[0] !== 'userpassword' ? req.body[key[0]] : sha(req.body[key[0]]);;
                    iterations++;
                    // console.log(key[0] + ':' + req.body[key[0]]);
                }
            }
            sql = sql.slice(0,-3); // removes last 'AND'

            console.log('sql:' + sql); //todo delete
            console.log(prms); //todo delete
            
            // EXECUTE UPDATE SQL
            var results = db.query(sql, prms, function (err, results, fields) {
                // console.log(results.affectedRows);
                if (err) {
                    //err while update
                    var apiResult = {};
                    apiResult.meta = {
                        table: table,
                        operation: 'UPDATE',
                        id: tablekeyvalue,
                        success: false,
                        err: err.message
                    };
                    res.json(apiResult);
                } else if(results.affectedRows === 0){
                    //err while sql ok but userid or userlogin or userpassword not ok
                    var apiResult = {};
                    apiResult.meta = {
                        table: table,
                        operation: 'UPDATE',
                        id: tablekeyvalue,
                        success: false,
                        err: 'WRONG_PARAMETERS_VALUES'
                    };
                    res.json(apiResult);
                } else {
                    //UPDATED
                    var apiResult = {};
                    apiResult.meta = {
                        table: table,
                        operation: 'UPDATE',
                        id: tablekeyvalue,
                        success: true,
                    };
                    res.json(apiResult);
                }
            });
        }
        //INSERT: IF body userlogin, userpassword but no userid then
        else if (userid == null && userlogin != null && userpassword != null) {
            if(tokenPayloadDecoded.isadmin === 0){
                res.json(JSON.parse(JSON.stringify({'ERR':'YOU_ARE_NOT_ADMIN, ONLY ADMIN CAN CREATE USERS'})));
            }else if(tokenPayloadDecoded.isadmin === 1) {
                // console.log("IF >> INSERT");
                let sql = 'INSERT INTO ??(';
                let fields = '??';
                let values = '?';

                //IF :ID given in path then create with given ID, if :ID not present create with generated ID
                var tablekeyvalue = uniqueid.getUniqueid();
                // console.log('tablekeyvalue: ' + tablekeyvalue); //todo delete

                var prms = [table];
                let bodyKeys = Object.keys(req.body);

                prms[prms.length] = tablekey;
                for (let key of bodyKeys) {
                    fields = fields + ',??';
                    prms[prms.length] = key;
                }
                prms[prms.length] = tablekeyvalue;
                for (let [key,value] of Object.entries(req.body)) {
                    // console.log('key:value = '+key+':'+value); //todo delete
                    values = values + ',?';
                    prms[prms.length] = key+''==='userpassword'? sha(value+'') : value;
                }

                sql = sql + fields + ') VALUES (' + values + ')';
                console.log('sql:' + sql); //todo delete
                console.log(prms); //todo delete

                var results = db.query(sql, prms, function (err, results, fields) {

                    if (err) {
                        //ADDED
                        var apiResult = {};
                        apiResult.meta = {
                            table: table,
                            operation: 'ADD',
                            id: tablekeyvalue,
                            success: false,
                            err: err.message
                        };
                        res.json(apiResult);
                    } else {
                        //ADDED
                        var apiResult = {};
                        apiResult.meta = {
                            table: table,
                            operation: 'ADD',
                            id: tablekeyvalue,
                            success: true,
                        };
                        res.json(apiResult);
                    }
                });
            }else{
                //wrong token, only admin can create user
                var apiResult = {};
                apiResult.meta = {
                    table: table,
                    operation: 'ADD',
                    id: tablekeyvalue,
                    success: false,
                    err: 'WRONG TOKEN'
                };
                res.json(apiResult);
            }
        } else {
            //WRONG PARAMETERS
            var apiResult = {};
            apiResult.meta = {
                table: table,
                operation: 'ADD',
                id: tablekeyvalue,
                success: false,
                err: 'WRONG_NAMES_OR_MISSING_BODY_PARAMS'
            };
            res.json(apiResult);
        }
    },

    //support functions
    isInArray: function(value, array) {
        return array.indexOf(value) > -1;
    },
};
module.exports = User;