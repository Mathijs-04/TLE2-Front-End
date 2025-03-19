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
            if (!handLandmarkerRef.current || !videoRef.current || !canvasRef.current) {
                console.warn("HandLandmarker, video of canvas niet beschikbaar.");
                return;
            }

            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Controleer of de video geldige afmetingen heeft
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            if (videoWidth === 0 || videoHeight === 0) {
                console.error("Video heeft ongeldige afmetingen (0x0).");
                return;
            }

            try {
                const results = await handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());

                // Extra controle: zijn er handen gedetecteerd?
                if (!results || !results.landmarks || results.landmarks.length === 0) {
                    console.warn("Geen hand gedetecteerd, detectie wordt overgeslagen.");
                    return;
                }

                for (let i = 0; i < results.landmarks.length; i++) {
                    const hand = results.landmarks[i];

                    if (!hand || hand.length === 0) {
                        console.warn(`Hand #${i} heeft geen geldige landmarks, wordt overgeslagen.`);
                        continue;
                    }

                    // Valideer de bounding box (ROI)
                    const roi = results.worldLandmarks?.[i]?.boundingBox;
                    if (!roi || roi.width <= 0 || roi.height <= 0) {
                        console.error(`Hand #${i} heeft een ongeldige ROI, wordt overgeslagen.`, roi);
                        continue;
                    }

                    // Roept de visualisatie functie aan
                    drawHand(hand, ctx, canvasRef.current);
                }
            } catch (error) {
                console.error("Fout bij het verwerken van hand detectie:", error);
            }

            // Vermijd eindeloze lus met kapotte frames
            setTimeout(() => requestAnimationFrame(visualizeHands), 100);
        }

        function drawHand(landmarks, ctx, canvas) {
            ctx.lineWidth = 2;

            const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4],
                [0, 5], [5, 6], [6, 7], [7, 8],
                [0, 9], [9, 10], [10, 11], [11, 12],
                [0, 13], [13, 14], [14, 15], [15, 16],
                [0, 17], [17, 18], [18, 19], [19, 20],
                [5, 9], [9, 13], [13, 17]
            ];

            // Find unique Z values for knuckles
            let zGroups = {};
            landmarks.forEach(p => {
                let roundedZ = Math.round(p.z * 10) / 10; // Round to 1 decimal for grouping
                if (!zGroups[roundedZ]) {
                    zGroups[roundedZ] = [];
                }
                zGroups[roundedZ].push(p);
            });

            // Get sorted Z depth levels (planes)
            let sortedZKeys = Object.keys(zGroups).map(Number).sort((a, b) => a - b);
            let minZ = sortedZKeys[0];
            let maxZ = sortedZKeys[sortedZKeys.length - 1];

            function getAlpha(z) {
                // Assign same alpha for all points in the same depth group
                let normalizedZ = (z - minZ) / (maxZ - minZ);
                return Math.max(0.2, 1 - normalizedZ); // At least 20% opacity
            }

            let depthAlpha = {};
            sortedZKeys.forEach(z => {
                depthAlpha[z] = getAlpha(z);
            });

            connections.forEach(([start, end]) => {
                let zStart = Math.round(landmarks[start].z * 10) / 10;
                let zEnd = Math.round(landmarks[end].z * 10) / 10;
                let alpha = (depthAlpha[zStart] + depthAlpha[zEnd]) / 2; // Average of the two depths

                ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`; // Green lines with transparency
                ctx.beginPath();
                ctx.moveTo(landmarks[start].x * canvas.width, landmarks[start].y * canvas.height);
                ctx.lineTo(landmarks[end].x * canvas.width, landmarks[end].y * canvas.height);
                ctx.stroke();
            });

            landmarks.forEach(point => {
                let zGroup = Math.round(point.z * 10) / 10;
                let alpha = depthAlpha[zGroup];

                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`; // Red circles with transparency
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
