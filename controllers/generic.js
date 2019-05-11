//todo clean console.log!!!
//todo responses with success:true
var db = require('../models/dbconnection');
var uniqueid = require('./uniqueid');

//create class
var Generic = {
    //SELECT ALL
    getAllItems: function (req, res) {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //query the DB using prepared statement
        var results = db.query('SELECT * from ??', [section], function (err, results, fields) {
            //if err, print blank results
            if (err) {
                // console.log(err);
                var apiResult = {};

                apiResult.meta = {
                    table: section,
                    type: "collection",
                    total: 0,
                    success: false,
                    err: err.message
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
    },
    //SELECT WHERE :wherekey=:wherevalue
    getItems: function (req, res) {
        let pathname = req._parsedUrl.pathname.split('/');
        let section = pathname[1];
        let wherekey = pathname[2];
        let wherevalue = pathname[3];

        var results = db.query('SELECT * from ?? WHERE ?? = ?', [section, wherekey, wherevalue], function (err, results, fields) {
            if (err) {
                // console.log(err);
                var apiResult = {};

                apiResult.meta = {
                    table: section,
                    type: "collection",
                    total: 0,
                    success: false,
                    err: err.message
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
    },
    //SELECT:id
    getItem: function (req, res) {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let table = pathname[1]+'s';
        let tablekey = pathname[1]+'id';
        let tablekeyvalue = pathname[2];

        console.log(table);
        console.log(tablekey);
        console.log(tablekeyvalue);

        //query the DB using prepared statement
        var results = db.query('SELECT * from ?? where ?? = ?', [table, tablekey, tablekeyvalue], function (err, results, fields) {
            //if err, print blank results
            if (err) {
                var apiResult = {};
                apiResult.meta = {
                    table: table,
                    type: "collection",
                    total: 0,
                    success: false,
                    err: err.message
                };
                apiResult.data = [];
                res.json(apiResult);
            }
            else {
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
    //INSERT /table/:id (BODY PROCESSED)
    //UPDATE /table/:id IF EXISTS (BODY PROCESSED)
    postItem: function (req, res) {
        // console.log(req); //to see all the goodies
        console.log("TRY INSERT");
        let sql = 'INSERT INTO ??(';
        let fields = '??';
        let values = '?';

        let pathname = req._parsedUrl.pathname.split('/');
        let table = pathname[1]+'s';
        let tablekey = pathname[1]+'id';

        var tablekeyvalue; //IF :ID given then create with given ID, if :ID not present create with generated ID
        if(pathname.length <=2) tablekeyvalue = uniqueid.getUniqueid();
        else tablekeyvalue = pathname[2];

        var prms = [table];

        let bodyKeys = Object.keys(req.body);

        prms[prms.length]=tablekey;
        for (let key of bodyKeys){
            fields = fields + ',??';
            prms[prms.length]=key;
        }
        prms[prms.length]=tablekeyvalue;
        for (let value of Object.values(req.body)) {
            values = values + ',?';
            prms[prms.length]=value;
        }

        sql = sql + fields +') VALUES ('+ values +')';
        console.log('sql:'+sql); //todo delete
        console.log(prms); //todo delete

        var results = db.query(sql, prms, function (err, results, fields) {

            if(err){
                if (err.errno === 1062) { //UPDATE because duplicated key
                    console.log("UPDATE");
                    //UPDATE
                    let sql = 'UPDATE ?? SET ';
                    var prms = [table];

                    var iterations = 1;
                    for (let key of Object.entries(req.body)) {

                        sql += ' ?? = ? ';
                        if (bodyKeys.length >= 2 && iterations !== bodyKeys.length) sql += ',';
                        prms[prms.length] = key[0];
                        prms[prms.length] = req.body[key[0]];
                        iterations++;
                        // console.log(key[0] + ':' + req.body[key[0]]);
                    }

                    sql += 'WHERE ?? = ?';
                    prms[prms.length] = tablekey;
                    prms[prms.length] = tablekeyvalue;

                    console.log('sql:' + sql); //todo delete
                    console.log(prms); //todo delete

                    var results = db.query(sql, prms, function (err, results, fields) {
                        if (err) {
                            //err while update operation
                            var apiResult = {};
                            apiResult.meta = {
                                table: table,
                                operation: 'UPDATE',
                                id: tablekeyvalue,
                                success: false,
                                err: err.message
                            };
                            res.json(apiResult);
                        }
                        else {
                            //successfuly updated a record to section table, [section][id]: tablekeyvalue
                            var apiResult = {};
                            apiResult.meta = {
                                table: table,
                                operation: 'UPDATE',
                                id: tablekeyvalue,
                                success: true
                            };
                            res.json(apiResult);
                        }
                    }); //UPDATE because duplicated key
                } else {
                    //error while adding
                    var apiResult = {};
                    apiResult.meta = {
                        table: table,
                        operation: 'ADD',
                        id: tablekeyvalue,
                        success: false,
                        err: err.message
                    };
                    res.json(apiResult);
                }
            }else{
                //successfuly added a record to section table, [section][id]: tablekeyvalue
                var apiResult = {};
                apiResult.meta = {
                    table: table,
                    operation: 'ADD',
                    id: tablekeyvalue,
                    success: true
                };
                res.json(apiResult);
            }
        });
    },
    //UPDATE:id/key1/:key1/key2/:key2/... (BODY IGNORED)
    putItem: function (req, res) {
        //UPDATE table SET field = value, field = value WHERE field = value
        let sql = 'UPDATE ?? SET ';

        let pathname = req._parsedUrl.pathname.split('/');
        let table = pathname[1]+'s';
        let tablekey = pathname[1]+'id';
        let tablekeyvalue = pathname[2];

        var prms = [table];

        if(pathname.length>=4) {
            for (let pathIterator = 3; pathIterator < pathname.length; pathIterator++) {
                if(pathIterator%2==0) {sql += '=? '; if(pathIterator>=5) sql += ',';}
                else {sql += '??';}
                prms[prms.length]=pathname[pathIterator];
            }
        }
        sql += 'WHERE ?? = ?';
        prms[prms.length]=tablekey;
        prms[prms.length]=tablekeyvalue;

        console.log('sql:'+sql);
        console.log(prms);

        var results = db.query(sql, prms, function (err, results, fields) {

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
            }
            else {
                //successfuly added a record to table, [section][id]: tablekeyvalue
                var apiResult = {};
                apiResult.meta = {
                    table: table,
                    operation: 'UPDATE',
                    id: tablekeyvalue,
                    success: true
                };
                res.json(apiResult);
            }
        });
    },

};
module.exports = Generic;