//@ts-ignore
import fb from 'fingerpose'
const { Finger, FingerCurl, FingerDirection, GestureDescription } = fb;

// describe raisedHand gesture ✋
const startGesture = new GestureDescription('start');


for (let finger of [
    Finger.Thumb,
    Finger.Index,
    Finger.Middle,
    Finger.Ring,
    Finger.Pinky
]) {

    startGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}
for (let finger of [
    Finger.Index,
    Finger.Middle,
    Finger.Ring,
    Finger.Pinky
]) {

    startGesture.addDirection(finger, FingerDirection.VerticalUp, 0.95);
    startGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.2);
    startGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 0.2);
}

// Thumb
startGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.5);
startGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.5);



export default startGesture;