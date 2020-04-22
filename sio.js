//
// SERVER CODE
//


var io = require('socket.io')();
var kurento = require('kurento-client');
var endpoints = {};
var candidatesQueue = {};
var users = {};

/*
 * connections from client browsers.
 * These could be teachers or pupils.
 */
io.on('connect',onConnect);

function onConnect(socket) {

	console.log('got socketio connection.');
	endpoints[socket]={};
	//socket.emit('news',{ donald: 'is dead. again'});

	socket.on('makecall',(data) => {
		console.log('offer_received');
		console.log(data);
		endpoints[socket].sdp=data.sdpOffer;
	});

	socket.on('message',(data) => {
		console.log('message');
		console.log(data);
	});

	socket.on('onIceCandidate',(data) => {
		console.log('socketio - onIceCandidate');
		onIceCandidate(socket.id,data.candidate);
	});

	var reg_data={};
	socket.on('register',(data) => {
		console.log('socketio - onRegistration: ' + data.username);
		endpoints[socket].username=data.username;
		users[data.username]={};
		users[data.username].session=socket;
		socket.emit('registration_success',reg_data);
		io.emit('teacher_connected',data);
	});

}

function onIceCandidate(sessionId, _candidate) {
	console.log('Session :' + sessionId);
	console.log('_candidate :' + JSON.stringify(_candidate));

	var candidate = kurento.getComplexType('IceCandidate')(_candidate);

	if (endpoints[sessionId]) {
		console.info('Sending candidate');
		var webRtcEndpoint = sessions[sessionId].webRtcEndpoint;
		webRtcEndpoint.addIceCandidate(candidate);
	}
	else {
		console.info('Queueing candidate');
		if (!candidatesQueue[sessionId]) {
			candidatesQueue[sessionId] = [];
		}
		candidatesQueue[sessionId].push(candidate);
	}
}

module.exports = io;
