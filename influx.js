/**
 * Created by IrekRomaniuk on 3/24/2016.
 */
var influx = require('influx');
module.exports = influx({
    host : '10.29.17.205',  // 'ironia'
    port : 8086, // optional, default 8086
    protocol : 'http', // optional, default 'http'
    username : 'dev',
    password : 'dev123',
    database : 'tmp'
});