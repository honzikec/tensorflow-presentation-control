import './style.css';
import { createDetector } from './hand-detector';


document.querySelector('#app').innerHTML = `
  <div>
    <video id="webcam" autoplay width="500" height="500"></video>
  </div>
`

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById('webcam');

  const directionChangeCallback = (direction) => {
    if (direction === 'thumbs_up') {
      triggerKeyboardEvent('ArrowRight');
      document.getElementById('arrow-right').classList.add('active');
      setTimeout(() => {
        document.getElementById('arrow-right').classList.remove('active');
      }, 500);
    } else if (direction === 'victory') {
      triggerKeyboardEvent('ArrowLeft');
      document.getElementById('arrow-left').classList.add('active');
      setTimeout(() => {
        document.getElementById('arrow-left').classList.remove('active');
      }, 500);
    }
  };

  function triggerKeyboardEvent(key) {
    const event = new KeyboardEvent('keydown', {
      key: key,
      code: key,
      keyCode: key === 'ArrowLeft' ? 37 : 39,
      which: key === 'ArrowLeft' ? 37 : 39,
      bubbles: true
    });
    document.dispatchEvent(event);
  }


  const detectorCreatedCallback = () => {
    console.log('Hand detector created');
  };

  createDetector(video, directionChangeCallback, detectorCreatedCallback);


  // Check if the browser supports getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Request access to the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        console.log('stream')
        // Set the video source to the webcam stream
        video.srcObject = stream;
      }).catch(error => {
        console.log('error', error)
      })
  }
});

