import React, {useEffect, useRef} from "react";
import {FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";
import KNear from "./handtracker/knear.js";
import JSONData1 from "./models/dataset1_rechts.json";
import JSONData2 from "./models/dataset2_rechts.json";
import JSONData3 from "./models/dataset3_rechts.json";
import JSONData4 from "./models/dataset4_rechts.json";
import JSONData5 from "./models/dataset5_rechts.json";
import JSONData6 from "./models/dataset6_rechts.json";

const HandTrackingComponent = ({onDetect}) => {
    const videoRef = useRef(null);
    const handLandmarkerRef = useRef(null);
    const machine = new KNear(1);
    const files = [JSONData1, JSONData2, JSONData3, JSONData4, JSONData5, JSONData6];

    useEffect(() => {
        async function initializeHandTracking() {
            console.log("Initializing hand tracking...");
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numHands: 2,
            });
            console.log("Hand tracking model loaded.");
            startWebcam();
        }

        function startWebcam() {
            console.log("Starting webcam...");
            navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    videoRef.current.onloadeddata = () => {
                        console.log("Webcam started. Loading model...");
                        importJSON();
                    };
                }
            }).catch((error) => {
                console.error("Error accessing webcam:", error);
            });
        }

        async function importJSON() {
            if (files.length > 0) {
                console.log("Loading training data...");
                await loadModel(files);
                console.log("Training data loaded. Starting detection loop...");
                startDetectionLoop();
            } else {
                console.error("No training files found.");
            }
        }

        async function loadModel(files) {
            for (const file of files) {
                for (const [key, value] of Object.entries(file)) {
                    console.log(`Training model with letter: ${key}`);
                    machine.learn(value, key);
                }
            }
        }

        async function detectSignLanguageCharacter() {
            if (!handLandmarkerRef.current) {
                console.error("Hand tracking model not initialized.");
                return;
            }

            const frameInterval = 20;
            const numFrames = 50;
            let collectedData = [];

            console.log("Starting gesture detection...");
            for (let i = 0; i < numFrames; i++) {
                const results = await handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());
                let detectArray = [];

                for (let hand of results.landmarks) {
                    const wrist = hand[0];
                    for (let handSingle of hand) {
                        let relX = handSingle.x - wrist.x;
                        let relY = handSingle.y - wrist.y;
                        let relZ = handSingle.z - wrist.z;
                        detectArray.push([relX, relY, relZ]);
                    }
                }

                collectedData.push(detectArray);
                await new Promise(resolve => setTimeout(resolve, frameInterval));
            }

            const flattenedData = collectedData.flat(Infinity);
            if (flattenedData.length > 0) {
                const result = machine.findNearest(flattenedData, 6);
                console.log("Gesture detection result:", result);
                if (onDetect) onDetect(result);
            } else {
                console.error("No data collected for gesture detection.");
            }
        }

        async function startDetectionLoop() {
            console.log("Starting detection loop...");
            while (true) {
                await detectSignLanguageCharacter();
                console.log("Waiting 3 seconds for next detection...");
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        initializeHandTracking();
    }, []);

    return (
        <div style={{position: 'absolute', bottom: 0}}>
            <video ref={videoRef} style={{transform: "scaleX(-1)", display: 'none'}} autoPlay></video>
        </div>
    );
};

export default HandTrackingComponent;
