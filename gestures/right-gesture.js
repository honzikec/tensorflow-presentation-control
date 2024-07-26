//@ts-ignore
import fb from 'fingerpose'
const { Finger, FingerCurl, FingerDirection, GestureDescription } = fb;

// describe right gesture
const rightGesture = new GestureDescription('right');

// All fingers have no curl
for (let finger of [
    Finger.Thumb,
    Finger.Index,
    Finger.Middle,
    Finger.Ring,
    Finger.Pinky
]) {
    rightGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Index, Middle, Ring, and Pinky fingers point right
for (let finger of [
    Finger.Index,
    Finger.Middle,
    Finger.Ring,
    Finger.Pinky
]) {
    rightGesture.addDirection(finger, FingerDirection.HorizontalRight, 1.0);
}

// Thumb points right
rightGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

export default rightGesture;
