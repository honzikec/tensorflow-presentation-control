import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as handdetection from '@tensorflow-models/hand-pose-detection';

let detector;
let globalVideoElement;
let globalDirectionChangeCallback;

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
    fp.Gestures.ThumbsUpGesture
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
                    return;
                }

                for (const hand of predictions) {

                    const est = GE.estimate(hand.keypoints3D, 9)
                    if (est.gestures.length > 0) {

                        // find gesture with highest match score
                        let result = est.gestures.reduce((p, c) => {
                            return (p.score > c.score) ? p : c
                        })
                        const chosenHand = hand.handedness.toLowerCase();
                        console.log(chosenHand, result.name, result.score);
                    }
                }
                const estimatedGestures = GE.estimate(predictions[0].keypoints3D, 5.5);
                console.log(estimatedGestures);


                requestAnimationFrame(runDetection);
            })
            .catch(err => console.error(err));
    }
}
