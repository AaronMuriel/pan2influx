/**
 * Created by IrekRomaniuk on 4/14/2016.
 */
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
const API = 'https://10.95.2.234/esp/restapi.esp?type=op&cmd=';
const CMD = '<show><running><resource-monitor><second></second></resource-monitor></running></show>';
const KEY = 'LUFRPT0wOFBSTWxOdGIvazFxRkc2b2VpZnNnTUEyc1E9QnRPY0ZGNWhMd3Rya3l6VndyZnVhUT09 =';

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
        console.log(body);
        //var output = parser.toJson(body);
        //console.log(output);
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
        var $ = cheerio.load(body, { xmlMode: true });
        //cpu-load-average->value, cpu-load-maximum->value, resource-utilization->value
        var values = _.map($('cpu-load-average').find('value'), function(item) {
            return $(item).text().split(',');
        });
        console.log(values[0]); // coreid 0 last min 1 sec
    } else console.log(error)
});
