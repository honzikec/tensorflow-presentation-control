import "./style.css";
import { createDetector } from "./hand-detector";

document.querySelector("#app").innerHTML = `
  <div>
    <video id="webcam" autoplay width="500" height="500"></video>
    <dialog id="myDialog"> JQuery > React</dialog>
    <dialog id="myDialog2">Pinnaple on pizza < Just Pizza</dialog>
  </div>
`;

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("webcam");
  const dialog = document.getElementById("myDialog");
  const dialog2 = document.getElementById("myDialog2");

  const directionChangeCallback = (direction) => {
    console.log("Direction changed:", direction);
  };
  const detectorCreatedCallback = () => {
    console.log("Hand detector created");
  };

  createDetector(
    video,
    directionChangeCallback,
    detectorCreatedCallback,
    dialog,
    dialog2
  );

  // Check if the browser supports getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Request access to the webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        console.log("stream");
        // Set the video source to the webcam stream
        video.srcObject = stream;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
});
