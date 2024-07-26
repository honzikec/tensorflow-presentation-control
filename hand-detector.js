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

function runDetection() {
    if (detector) {
        if (globalVideoElement.readyState !== 4) {
            requestAnimationFrame(runDetection);
            return;
        }

        detector.estimateHands(globalVideoElement)
            .then(predictions => {
                if (predictions.length === 0) {
                    requestAnimationFrame(runDetection);
                    return;
                }

                const direction = getHandDirection(
                    predictions[0].keypoints,
                    estimateCurledFingers(predictions[0].keypoints3D)
                );
                globalDirectionChangeCallback(direction);

                requestAnimationFrame(runDetection);
            })
            .catch(err => console.error(err));
    }
}

function getHandDirection(keypoints, curledFingers) {
    console.log('Curled fingers:', curledFingers);
    console.log('Keypoints:', keypoints);
    const centerPoint = calculateCenterPoint(keypoints);

    const fingerTips = keypoints.filter(
        keypoint =>
            keypoint.name?.endsWith('_tip') &&
            !curledFingers.some(f => keypoint.name?.startsWith(f))
    );

    fingerTips.sort((a, b) => b.y - a.y);
    const downmostFingerPoint = fingerTips[0];
    const upmostFingerPoint = fingerTips[fingerTips.length - 1];

    fingerTips.sort((a, b) => b.x - a.x);
    const leftmostFingerPoint = fingerTips[0];
    const rightmostFingerPoint = fingerTips[fingerTips.length - 1];

    const deltas = [
        { direction: 'Left', delta: leftmostFingerPoint.x - centerPoint.x },
        { direction: 'Right', delta: centerPoint.x - rightmostFingerPoint.x },
        { direction: 'Up', delta: centerPoint.y - upmostFingerPoint.y },
        { direction: 'Down', delta: downmostFingerPoint.y - centerPoint.y }
    ];

    deltas.sort((a, b) => b.delta - a.delta);

    return deltas[0].direction;
}

function calculateCenterPoint(points) {
    const numPoints = points.length;
    let sumX = 0;
    let sumY = 0;

    for (const point of points) {
        sumX += point.x;
        sumY += point.y;
    }

    return {
        x: sumX / numPoints,
        y: sumY / numPoints
    };
}

function isFingerCurl(fingerTip, fingerDip, fingerPip, fingerMcp) {
    if (!fingerTip || !fingerDip || !fingerPip || !fingerMcp) {
        return false;
    }

    const dx1 = fingerTip.x - fingerDip.x;
    const dy1 = fingerTip.y - fingerDip.y;
    const dz1 = fingerTip.z - fingerDip.z;

    const dx2 = fingerPip.x - fingerMcp.x;
    const dy2 = fingerPip.y - fingerMcp.y;
    const dz2 = fingerPip.z - fingerMcp.z;

    return dx1 * dx2 + dy1 * dy2 + dz1 * dz2 < 0;
}

function estimateCurledFingers(points) {
    const pointMap = new Map(points.map(p => [p.name, p]));

    const curledFingers = [];

    const fingers = [
        'index_finger',
        'middle_finger',
        'ring_finger',
        'pinky_finger'
    ];

    for (const finger of fingers) {
        if (isFingerCurl(
            pointMap.get(`${finger}_tip`),
            pointMap.get(`${finger}_dip`),
            pointMap.get(`${finger}_pip`),
            pointMap.get(`${finger}_mcp`)
        )) {
            curledFingers.push(finger);
        }
    }

    return curledFingers;
}
