var json2csv = require('json2csv');
 
exports.get = function(req, res) {
 
    var fields = [
        'address',
        'name',
        'symbol',
        'decimals'
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=tokens.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
 
};