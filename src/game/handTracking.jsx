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
    const canvasRef = useRef(null);


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
                        importJSON().then(visualizeHands);
                        startRealTimeDetection();
                    };
                }
            }).catch((error) => {
                console.error("Error accessing webcam:", error);
            });
        }

        async function visualizeHands() {
            // DEBUG Functie kan uit kost volgens mij veel performance
            if (!handLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            const results = await handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());

            if (results.landmarks.length > 0) {
                for (let hand of results.landmarks) {
                    // roept de visualisatie functie aan
                    drawHand(hand, ctx, canvasRef.current);
                }
            }

            requestAnimationFrame(visualizeHands);
        }

        function drawHand(landmarks, ctx, canvas) {
            // functie om de hand posities te visualiseren
            ctx.fillStyle = "red";
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;

            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20],
                [5, 9], [9, 13], [13, 17]
            ];

            connections.forEach(([start, end]) => {
                ctx.beginPath();
                ctx.moveTo(landmarks[start].x * canvas.width, landmarks[start].y * canvas.height);
                ctx.lineTo(landmarks[end].x * canvas.width, landmarks[end].y * canvas.height);
                ctx.stroke();
            });

            landmarks.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, Math.PI * 2);
                ctx.fill();
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
        <div style={{
            position: 'absolute',
            paddingTop: '520px',
            marginRight: '850px'


        }}>
            <video ref={videoRef} style={{
                transform: "scaleX(-1)",
                display: 'none'
            }} autoPlay>
            </video>
            <canvas
                ref={canvasRef}
                style={{
                    transform: "scaleX(-1)",
                    display: "fixed",
                    bottom: "500px",
                }}
            ></canvas>
        </div>
    );
};

export default HandTrackingComponent;
