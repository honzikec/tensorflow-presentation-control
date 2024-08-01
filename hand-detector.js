import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as handdetection from '@tensorflow-models/hand-pose-detection';

let detector;
let globalVideoElement;
let globalDirectionChangeCallback;

let currentGesture = null;
let lastGestureTimestamp = null;
const gestureTimeout = 3000; // 3 seconds timeout

export function createDetector(videoElement, directionChangeCallback, detectorCreatedCallback) {
    globalVideoElement = videoElement;
    globalDirectionChangeCallback = directionChangeCallback;

    handdetection.createDetector(handdetection.SupportedModels.MediaPipeHands, {
        runtime: 'tfjs',
        modelType: 'lite',
        maxHands: 1
    }).then(d => {
        detector = d;
        detectorCreatedCallback();
        runDetection();
    }).catch(err => console.error(err));
}

const GE = new fp.GestureEstimator([
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
]);

function runDetection() {
    if (detector) {
        if (globalVideoElement.readyState !== 4) {
            requestAnimationFrame(runDetection);
            return;
        }

        detector.estimateHands(globalVideoElement, true)
            .then(predictions => {
                if (predictions.length === 0) {
                    requestAnimationFrame(runDetection);
                    resetGestureDetection();
                    return;
                }

                for (const hand of predictions) {
                    const est = GE.estimate(hand.keypoints3D, 9.3)
                    if (est.gestures.length > 0) {
                        // Find gesture with highest match score
                        let result = est.gestures.reduce((p, c) => (p.score > c.score) ? p : c);

                        const currentTimestamp = new Date().getTime();
                        if ((result.name === 'victory' || result.name === 'thumbs_up') && shouldTriggerGesture(result.name, currentTimestamp)) {
                            globalDirectionChangeCallback(result.name);
                            lastGestureTimestamp = currentTimestamp;
                            currentGesture = result.name;
                        }
                    }
                }
                requestAnimationFrame(runDetection);
            })
            .catch(err => console.error(err));
    }
}

function shouldTriggerGesture(gestureName, currentTimestamp) {
    if ((!currentGesture || currentGesture !== gestureName) && (currentTimestamp - lastGestureTimestamp) > gestureTimeout) {
        return true;
    }
    return false;
}

function resetGestureDetection() {
    currentGesture = null;
}
