document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('webcam');

    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request access to the webcam
        navigator.mediaDevices.getUserMedia({video: true})
            .then(function (stream) {
                // Set the video source to the webcam stream
                video.srcObject = stream;
            })
    }
});
