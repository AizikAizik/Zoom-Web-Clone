const socket = io('/');

const domVideo = document.createElement('video');

domVideo.muted = true;

const videoGrid = document.getElementById('video-grid');

//initialize peer connection
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '4000'
})

const peers = {};

var myVideoStream;

// promise to get video and audio stream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(domVideo, myVideoStream);

    console.log(peer);

    socket.on('user-connected', (userId) => {
        //console.log(`user connected ${userId}`);
        myVideoStream = stream;
        console.log('inside user connected', myVideoStream)
        connectToNewUser(userId, myVideoStream);
    })

    socket.on('user-disconnected', userId => {
        console.log(`${userId} left the room`, peers);
        if (peers[userId])
            peers[userId].close();
    })

})

peer.on('call', call => {
    // promise to get video and audio stream
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        myVideoStream = stream;
        addVideoStream(domVideo, myVideoStream);

        console.log('inside call', myVideoStream);
        call.answer(myVideoStream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
        video.muted = true;

        socket.on('user-disconnected', userId => {
            console.log(`${userId} left the room`, peers);
            if (peers[userId])
                peers[userId].close();
        })

    })
})

//peer events listeners
peer.on('open', id => {
    // emit socket events
    socket.emit('join-room', ROOM_ID, id);
})

// add messages
let text = $('input');

$('html').keydown(e => {
    if (e.which === 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit('message', text.val());
        text.val('');
    }
})

socket.on('createMessage', (message, userName) => {
    $('ul').append(`
    <li class="message p-2 m-2">
        <b>${userName}</b>
        <br />
        ${message}
    </li>`
    );
    scrollToBottom();
})

// add a video stream
function addVideoStream(video, stream) {
    myVideoStream = stream;
    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    myVideoStream = stream;
    const video = document.createElement('video');
    console.log('connect to new user', stream);

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })

    video.muted = true;

    call.on('close', () => {
        video.remove();
    })

    peers[userId] = call;
}

// scroll to bottom function
function scrollToBottom() {
    const d = $('.main__chat_window');

    d.scrollTop(d.prop('scrollHeight'))
}

function MuteUnmute() {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

function setMuteButton() {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `;

    document.querySelector('.main__mute__button').innerHTML = html;
}

function setUnmuteButton() {
    const html = `
        <i class="fas fa-microphone-slash unmute"></i>
        <span>UnMute</span>
    `;

    document.querySelector('.main__mute__button').innerHTML = html;
}

function playstop() {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;

    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

function setStopVideo() {
    let html = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `;

    document.querySelector('.main__video_button').innerHTML = html;
}

function setPlayVideo() {
    let html = `
        <i class="fas fa-video-slash stop"></i>
        <span>Play Video</span>
    `;

    document.querySelector('.main__video_button').innerHTML = html;
}