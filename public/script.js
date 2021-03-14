const socket = io('/') ;

const domVideo = document.createElement('video');

const videoGrid = document.getElementById('video-grid');

//initialize peer connection
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '4000'
})

// mute the video by default
domVideo.muted = true;

let myVideoStream;

// add a video stream
const addVideoStream = (video, stream) =>{
    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () =>{
        video.play();
    });
    videoGrid.append(video);
}

// promise to get video and audio stream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(domVideo,stream);

//     peer.on('call', call =>{
//         call.answer(stream);
//         const video = document.createElement('video');
//         call.on('stream', userVideoStream =>{
//             addVideoStream(video, userVideoStream)
//         })
//     })

//     socket.on('user-connected', (userId) =>{
//         connectToNewUser(userId, stream);
//    })

})

peer.on('call', call =>{
    call.answer(myVideoStream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
})

socket.on('user-connected', (userId) =>{
    connectToNewUser(userId, myVideoStream);
})

//peer events listeners
peer.on('open', id => {
    // emit socket events
    socket.emit('join-room', ROOM_ID, id);
})

function connectToNewUser(userId, stream){
   const call = peer.call(userId, stream);
   const video = document.createElement('video');

   call.on('stream', userVideoStream =>{
       addVideoStream(video, userVideoStream)
   })
}