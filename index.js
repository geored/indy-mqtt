var amqp = require('amqplib/callback_api');
var admin = require("firebase-admin");

var serviceAccount = require("./serviceaccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://indyperf-1.firebaseio.com"
});



admin.database().ref("/indy").on('child_added' , function(snapshot) {
	var data = snapshot.val()


	var gitData = data.value
	var name = gitData.pusher.name
	var gitRepo = gitData.repository.git_url
	var gitBranch = gitData.ref

	console.log(`[${name}] pushed new code at:  '${gitRepo}' @ branch: ${gitBranch}` );

	amqp.connect("amqp://vfujqvkx:xsyZHnPGRhMq8dfLld5mKhQFvyFqpYax@bear.rmq.cloudamqp.com/vfujqvkx" , function(err,conn) {
		conn.createChannel(function(err, ch) {
			var q = "indy";
			var data = {time: Date.now() , value: gitData }
			ch.assertQueue(q,{durable:false});
			ch.sendToQueue(q , new Buffer(JSON.stringify(data)) );
			console.log(`[${name}] pushed new code at:  '${gitBranch}' `);
		});
		setTimeout(() => {
		  conn.close();
		  // process.exit(0);
		}, 3000);
	});
});






