//@ts-ignore
import fb from 'fingerpose'
const { Finger, FingerCurl, FingerDirection, GestureDescription } = fb;

// describe left gesture
const leftGesture = new GestureDescription('left');

// All fingers have no curl
for (let finger of [
    Finger.Thumb,
    Finger.Index,
    Finger.Middle,
    Finger.Ring,
    Finger.Pinky
]) {
    leftGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Index, Middle, Ring, and Pinky fingers point left
for (let finger of [
    Finger.Index,
    Finger.Middle,
    Finger.Ring,
    Finger.Pinky
]) {
    leftGesture.addDirection(finger, FingerDirection.HorizontalLeft, 1.0);
}

// Thumb points left
leftGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);

export default leftGesture;
