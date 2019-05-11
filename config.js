require('dotenv').config();
// var path = require('path');
// var absolutePath = path.resolve('');

module.exports = {

    'port': process.env.PORT,

    'secret': process.env.APP_SECRET,
    'supersecret': process.env.APP_SECRET, //+absolutePath, //absolutepath to config file included (this will not work with many nodes of the app, absolute path have to be removed then)
    'tokenLifeTime': process.env.TTL || '7d', //todo consider 1440 or lower

    'mysqlhost'     : process.env.DATABASE_HOST,
    'mysqluser'     : process.env.DATABASE_USER,
    'mysqlpassword' : process.env.DATABASE_PASSWORD,
    'mysqldatabase' : process.env.DATABASE_NAME,

    // //initializes supersecret
    // getSuperSecret: function(){
    //
    //     this.supersecret=this.secret+absolutePath;
    //     return this.supersecret;
    // },

    'encKey': process.env.ENC_KEY,

    decr: function(c) {
        // c = decodeURIComponent(c);
        var u = "";
        var chr;
        for (var i = c.length - 1; i >= 0; i--) {
            chr = c.charAt(i);
            u += (this.encKey.indexOf(chr)>=0 && this.encKey.indexOf(chr)<=9) ?
                String.fromCharCode(48 + this.encKey.indexOf(chr)) :
                (this.encKey.indexOf(chr)>=18 && this.encKey.indexOf(chr)<=43) ?
                    String.fromCharCode(65 + this.encKey.indexOf(chr) - 18) :
                    (this.encKey.indexOf(chr)>=50 && this.encKey.indexOf(chr)<=75) ?
                        String.fromCharCode(97 + this.encKey.indexOf(chr) - 50) : null;
        }
        return u;
    },
    encr: function(u) {
        var c = "";
        var chr;
        for (var i = u.length - 1; i >= 0; i--) {
            chr = u.charCodeAt(i);
            c += (chr >= 65 && chr <= 90) ?
                this.encKey.charAt(chr - 47 - 59*Math.floor(Math.random())) :
                (chr >= 97 && chr <= 122) ?
                    this.encKey.charAt(chr - 47 + 85*Math.floor(Math.random())) :
                    (chr >= 48 && chr <= 57) ?
                        this.encKey.charAt(chr - 48 + 10*Math.floor(Math.random())) :
                        null;
        }
        // return encodeURIComponent(c);
        return c;
    },

};