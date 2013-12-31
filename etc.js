var fs = require('fs');
var path = require('path');
var util = require('util');
var settings = require('./settings.js');

module.exports = function (off, err) {
    if (err) throw err;

    fs.readFile(settings.hosts, function (err, data) {
        if (err) throw err;

        var clean = data.toString().split('\n').filter(original).join('\n');

        if (off) {
            fs.writeFile(settings.hosts, clean, capture(lifted));
        } else {
            var hose = clean + '\n' + Object.keys(settings.domains).map(lines).join('\n');
            fs.writeFile(settings.hosts, hose, capture(hosed));
        }
    });

    var generated = '# generated by hose';
    var rgenerated = new RegExp(generated, 'i');

    function original (line) {
        return !rgenerated.test(line);
    }

    function lines (domain) {
        return util.format('0.0.0.0\t%s\t\t\t%s', domain, generated);
    }

    function capture (then) {
        return function (err) {
            if (err) throw err;
            then();
        };
    }

    function lifted () {
        console.log('Hose lifted.');
    }

    function hosed () {
        console.log('Go get some work done.');
    }
};
