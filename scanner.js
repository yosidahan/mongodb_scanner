
var iprange = require('iprange');
var readline = require('readline');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var q = async.queue(function (task, callback) {
	var url = 'mongodb://' + task + ':27017/test';
	console.log(url);
	MongoClient.connect(url, function (err, db) {
		if (err) {
			callback(err);
		} else {
			db.close();
			callback(null, "Connected correctly to DB");
		}
	});
}, 100);

q.drain = function () {
	console.log('all items have been processed');
};

rl.question("Please type IP with subnet in order to create a range: ", function (answer) {

	var range = iprange(answer);
	var mongoPorts = ['27017', '27018', '27019'];

	console.log('Generated', range.length, 'IPs.', range[0], '-', range[range.length - 1]);

	range.forEach(function (ip) {
		mongoPorts.forEach(function (mongoPort) {
			q.push(ip + ':' + mongoPort, function (err, res) {
				if (err)
					console.log(err);
				else
					console.log(res);
			});
		});
	});
});

 		

 		