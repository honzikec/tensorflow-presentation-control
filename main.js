import './style.css'


document.querySelector('#app').innerHTML = `
  <div>
    <video id="webcam" autoplay></video>
  </div>
`

document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('webcam');
    console.log("WORKING?", video)


    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request access to the webcam
        navigator.mediaDevices.getUserMedia({video: true})
            .then(function (stream) {
                console.log('stream')
                // Set the video source to the webcam stream
                video.srcObject = stream;
            }).catch(error => {
                console.log('error', error)
            })
    }
});
