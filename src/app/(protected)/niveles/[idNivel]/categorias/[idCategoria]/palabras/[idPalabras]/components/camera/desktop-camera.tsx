"use client";

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Card, CardContent } from "@/components/ui/card";
import * as mpPose from '@mediapipe/pose';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';

export default function DesktopCamera() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [frames, setFrames] = useState<number[]>([]);
  const poseRef = useRef<Pose>();

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);
    poseRef.current = pose;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 500); // Captura una frame cada 500ms (ajusta según sea necesario)

    return () => clearInterval(interval);
  }, [frames]);

  const captureFrame = () => {
    if (webcamRef.current && webcamRef.current.video && poseRef.current) {
      const video = webcamRef.current.video;
      poseRef.current.send({ image: video });
    }
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: mpPose.NormalizedLandmarkList, color: string) => {
    for (const landmark of landmarks) {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  };

  const drawConnectors = (ctx: CanvasRenderingContext2D, landmarks: mpPose.NormalizedLandmarkList, connections: Array<[number, number]>, color: string) => {
    for (const [startIdx, endIdx] of connections) {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];

      if (start && end) {
        ctx.beginPath();
        ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
        ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  const onResults = (results: mpPose.Results) => {
    if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dibujar el frame de video
    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // Dibujar los landmarks y conexiones
    if (results.poseLandmarks) {
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, '#00FF00');
      drawLandmarks(ctx, results.poseLandmarks, '#FF0000');
    }

    ctx.restore();

    // Extraer los keypoints
    const keypoints = results.poseLandmarks;

    if (keypoints && keypoints.length === 33) {
      const frameData = keypoints.flatMap(landmark => [landmark.x, landmark.y, landmark.z, landmark.visibility]);
      const adjustedFrameData = frameData.slice(0, 124);
      const paddedFrameData = adjustedFrameData.concat([0, 0]);

      setFrames(prevFrames => {
        const newFrames = [...prevFrames, ...paddedFrameData].filter(value => value !== undefined);
        if (newFrames.length >= 2520) {
          const dataToSend = newFrames.slice(0, 2520);
          sendPrediction(dataToSend);
          return [];
        }
        return newFrames;
      });
    }
  };

  const sendPrediction = async (data: number[]) => {
    try {
      const response = await fetch('http://localhost:4000/api/sign-language/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames: data }),
      });
      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error) {
      console.error('Error al obtener la predicción:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className='p-6'>
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            className="w-full h-full object-cover rounded-lg"
            mirrored
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
          />
        </div>
        {prediction !== null && (
          <div className="mt-4">
            <h2>Predicción: {prediction}</h2>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
