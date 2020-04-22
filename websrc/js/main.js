//
// BROWSER CLIENT
//

var kurentoUtils=require('kurento-utils');

import io from 'socket.io-client';

const signals=io.connect('https://rtc.greensideproductions.com.au/');

var video_local;
var video_remote;
var startBtn;
var registerBtn;
var webRtcPeer;
var userNameCtl;
var userName;

window.onload=function() {
	console.log(kurentoUtils);

	video_local = document.getElementById('video_local');
	video_remote = document.getElementById('video_remote');
	userNameCtl=document.getElementById('username');


	startBtn = document.getElementById('startbtn');
	registerBtn = document.getElementById('registerbtn');

	registerBtn.onclick=function() {
		userName=userNameCtl.value;

		console.log('registering username: ' + userName);
		var regkey={
			key:'blah',
			username:userName
		};
		signals.emit('register',regkey);
	};

	startBtn.onclick=function (blah) {
		console.log(blah + "button got clicked");
		var constraints = {
			audio: true,
			video: {
				width: 640,
				framerate: 15
			}
		};
		var options= {
			localVideo : video_local,
			remoteVideo : video_remote,
			onicecandidate : onIceCandidate,
			mediaConstraints: constraints
		};
		webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
			if (error) return onError(error);
			this.generateOffer(onOfferPresenter);
		});
	};

}

function onOfferPresenter(error, offerSdp) {

	console.log('offer is ready for presentation');

	if (error) return onError(error);

	var message = {
		id: userName,
		sdpOffer: offerSdp
	}

	signals.emit('makecall',message);
}


function onIceCandidate(candidate) {
	console.log('Local candidate' + JSON.stringify(candidate));

	var message = {
		id : 'onIceCandidate',
		candidate : candidate
	}
	signals.emit('onIceCandidate',message);
}

signals.on('registration_success',(data) => {
	console.log('registration success. Enabling start');
	startBtn.disabled=false;
});

signals.on('news', (data) => {
	console.log(data);
	signals.emit('message','heeeeeelp me from client');
});

// incoming offers 
signals.on('offer_sdp', (data) => {
	console.log("incoming sdp offer: "+data);
	WebRtcPeer.processAnswer(data.sdp);
});

// incoming ice candidates
signals.on('ice_candidate', (data) => {
	console.log("incoming ice candidate: "+data);
	WebRtcPeer.addIceCandidate(data.icecandidate);
});
