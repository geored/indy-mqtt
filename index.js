var amqp = require('amqplib/callback_api');
var admin = require("firebase-admin");

var serviceAccount = require("./serviceaccountkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://indyperf-1.firebaseio.com"
});



admin.database().ref("/indy").on('child_added' , function(snapshot) {
	var gitData = JSON.parse( snapshot.val().value.payload );
	console.log('GIT BRANCHE CHANGED: ' , gitData.ref );

	amqp.connect("amqp://vfujqvkx:xsyZHnPGRhMq8dfLld5mKhQFvyFqpYax@bear.rmq.cloudamqp.com/vfujqvkx" , function(err,conn) {
		conn.createChannel(function(err, ch) {
			var q = "indy";
			var data = {time: Date.now() , value: gitData }
			ch.assertQueue(q,{durable:false});
			ch.sendToQueue(q , new Buffer(JSON.stringify(data)) );
			console.log(`[x] send message  '${data}' `);
		});
		setTimeout(() => {
		  conn.close();
		  process.exit(0);
		}, 3000);
	});
});






