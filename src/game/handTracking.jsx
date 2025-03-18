import React, { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import KNear from "./handtracker/knear.js";
import JSONData1 from "./models/allmoveset_rechts.json";

const HandTrackingComponent = ({ onDetect }) => {
    const videoRef = useRef(null);
    const handLandmarkerRef = useRef(null);
    const machine = new KNear(1);
    const files = [JSONData1];
    const animationFrameRef = useRef(null);

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
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    videoRef.current.onloadeddata = () => {
                        console.log("Webcam started. Loading model...");
                        importJSON();
                        startRealTimeDetection();
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
                console.log("Training data loaded.");
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

        async function processFrame() {
            if (!handLandmarkerRef.current || !videoRef.current) return;

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

            if (detectArray.length > 0) {
                const flattenedData = detectArray.flat();
                const result = machine.findNearest(flattenedData, 2);
                // console.log(result);
                if (onDetect) onDetect(result);
            }

            animationFrameRef.current = requestAnimationFrame(processFrame);
        }

        function startRealTimeDetection() {
            console.log("Starting real-time detection...");
            animationFrameRef.current = requestAnimationFrame(processFrame);
        }

        initializeHandTracking();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div style={{ position: 'absolute', bottom: 0 }}>
            <video ref={videoRef} style={{ transform: "scaleX(-1)", display: 'none' }} autoPlay></video>
        </div>
    );
};

export default HandTrackingComponent;
