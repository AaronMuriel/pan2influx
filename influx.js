/**
 * Created by IrekRomaniuk on 3/24/2016.
 */
var influx = require('influx');
module.exports = influx({
    //cluster configuration
    /*hosts : [
        {
            host : 'ironia',
            port : 8060, //optional. default 8086
            protocol : 'http' //optional. default 'http'
        }
    ],*/
    // or single-host configuration
    host : '10.29.17.205',  // 'ironia'
    port : 8086, // optional, default 8086
    protocol : 'http', // optional, default 'http'
    username : 'firewall',
    password : 'n3w@yn',
    database : 'shields'
});
