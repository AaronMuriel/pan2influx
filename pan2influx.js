/**
 * Created by IrekRomaniuk on 4/14/2016.
 */
//"use strict";
var request = require('request');
/*"xml2js":"*",
 "xml2json":"*",
 "xpath":"*",
 "xmldom":"*",*/
//var parser = require('xml2json');
//var xml2js = require('xml2js');
/*var xpath = require('xpath')
 , dom = require('xmldom').DOMParser;*/
var cheerio = require('cheerio');
var _ = require('lodash');
var influx = require('./influx');
const FW = process.env.FW;
const IP = process.env.IP;
const LOCATION = process.env.LOCATION;
const API = 'https://' + IP + '/esp/restapi.esp?type=op&cmd=';
const CMD = '<show><running><resource-monitor><second></second></resource-monitor></running></show>';
const KEY = process.env.KEY;
//console.log(IP, API, KEY);
var date = new Date();
var URL = API + CMD + '&key=' + KEY;

var options = {
    url: URL,
    strictSSL: false,
    accept: 'text/xml'
    /*headers: {
     'User-Agent': 'request'
     }*/
};

request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body);
        var dsp = ['dp0', 'dp1', 'dp2'];
        var $ = cheerio.load(body, {xmlMode: true});
        //cpu-load-average->value, cpu-load-maximum->value, resource-utilization->value
        dsp.forEach(function (dp) {
            var values = _.map($(dp + ' cpu-load-average').find('value'), function (item) {
                //console.log($(item).text().split(','));
                return $(item).text().split(',');
            });
            //console.log(values.length);
            var coreid = 0;
            values.forEach(function (value) {
                //console.log(value, typeof(value));
                var max = getMaxOfArray(value);
                coreid++;
                console.log(date, max, FW, dp, coreid); // last min max
                influx.writePoint('cpu', {time: date, value: max}, {site: LOCATION, firewall: FW, dsp: dp, coreid: coreid},
                    function (err, response) {
                        if (err) console.log("Influxdb error");
                    })
                /*influx.writePoints([  //v1.1.0
                    {
                        measurement: 'cpu',
                        tags: { site: LOCATION, firewall: FW, dsp: dp, coreid: coreid },
                        fields: { cpu: max },
                        timestamp: date
                    }
                ])*/
            });
        })
    } else console.log(error)
});

    /*
     <cpu-load-average><coreid>0</coreid>
     <cpu-load-average><coreid>1</coreid>
     <cpu-load-maximum><coreid>0</coreid>
     <cpu-load-maximum><coreid>1</coreid>
     <resource-utilization><name>session</name>
     <resource-utilization><name>packet buffer</name>
     <resource-utilization><name>packet descriptor</name>
     <resource-utilization><name>sw tags descriptor</name>
     */
    //GOOD - using xpath and xmldom
    //var doc = new dom().parseFromString(body);
    //var nodes = xpath.select("//value", doc);
    //console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
    //console.log("node: " + nodes[0].toString())
    //console.log(nodes[1].firstChild.data.split(',')[0]); // coreid 1 last min 1 sec
    //BETTER using cheerio

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}