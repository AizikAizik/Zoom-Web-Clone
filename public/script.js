const domVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');

// mute the video by default
domVideo.muted = true;

let myVideoStream;

const addVideoStream = (video, stream) =>{
    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () =>{
        video.play();
    });
    videoGrid.appendChild(domVideo);
}

// promise to get video and audio stream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(domVideo,stream);
})