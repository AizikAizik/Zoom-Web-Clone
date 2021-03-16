const socket = io('/');

let rand = Math.floor(Math.random() * 100);

const domVideo = document.createElement('video');

const videoGrid = document.getElementById('video-grid');

//initialize peer connection
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '4000'
})

// mute the video by default
// domVideo.muted = true;

let myVideoStream;

// add a video stream
const addVideoStream = (video, stream) => {
    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

// promise to get video and audio stream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(domVideo, myVideoStream);

    // socket.on('user-connected', (userId) => {
    //     connectToNewUser(userId, stream);
    // })

    socket.on('user-connected', (userId) => {
        console.log(`user connected ${userId}`);
        connectToNewUser(userId, myVideoStream);
    })

    // peer.on('call', call => {
    //     call.answer(myVideoStream);
    //     const video = document.createElement('video');
    //     call.on('stream', userVideoStream => {
    //         addVideoStream(video, userVideoStream);
    //     })
    //     console.log('call', call);
    // })

})

peer.on('call', call => {
    console.log('call', call);
    call.answer(myVideoStream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
})

//peer events listeners
peer.on('open', id => {
    // emit socket events
    socket.emit('join-room', ROOM_ID, id);
})

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    console.log('call', call)
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

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

// scroll to bottom function
function scrollToBottom(){
    const d = $('.main__chat_window');

    d.scrollTop(d.prop('scrollHeight'))
}

function MuteUnmute(){
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

function setMuteButton(){
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `;

    document.querySelector('.main__mute__button').innerHTML = html;
}

function setUnmuteButton(){
    const html = `
        <i class="fas fa-microphone-slash unmute"></i>
        <span>UnMute</span>
    `;

    document.querySelector('.main__mute__button').innerHTML = html;
}

function playstop(){
    let enabled = myVideoStream.getVideoTracks()[0].enabled;

    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

function setStopVideo(){
    let html = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `;

    document.querySelector('.main__video_button').innerHTML = html;
}

function setPlayVideo(){
    let html = `
        <i class="fas fa-video-slash stop"></i>
        <span>Play Video</span>
    `;

    document.querySelector('.main__video_button').innerHTML = html;
}