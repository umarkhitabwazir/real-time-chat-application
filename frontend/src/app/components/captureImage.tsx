'use client'

import React, {  useRef, useState } from 'react';
import Image from 'next/image';

export default function CameraCapture(
    { setImagePreview,  setOpenCamera }
        :
        {
            setImagePreview: React.Dispatch<React.SetStateAction<string | null>>,
            setOpenCamera: React.Dispatch<React.SetStateAction<boolean>>,

        }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const[ifCameraOff,setIfCameraOff]=useState(false)
    const [loading, setLoading] = useState(false);
    const stopCamera =  () => {
        if (streamRef.current) {
            const track =streamRef.current.getTracks()
            console.log('Stopping camera stream', track);
            track.forEach(t => t.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            streamRef.current = null;
        }
        setOpenCamera(false);
    };


    const startCamera = async () => {
        setLoading(true);
        setIfCameraOff(false)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                streamRef.current = stream;
                videoRef.current.srcObject = stream;
            }
            setLoading(false);
            setIfCameraOff(true)
        } catch (err) {
            setLoading(false);
            setIfCameraOff(false)
            console.error('Error accessing camera:', err);
        }
    };
   
    const capturePhoto = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                console.log('Captured image:', canvas);
                const base64Image = canvas.toDataURL('image/png')
                setImagePreview(base64Image);
                       setOpenCamera(false);

                stopCamera()

            }
        }
    };

    return (
        <div className="inset-0  fixed w-full flex flex-col items-center gap-2 justify-center ">
          {ifCameraOff &&  <button
                onClick={async () => {
                    stopCamera();
                }}
                className="relative sm:top-9 z-70 sm:left-50  flex items-center justify-center text-4xl text-gray-500 bg-white w-auto h-6 cursor-pointer   hover:text-red-600"
                aria-label="Close"
            >
                &times;
            </button>}
            <div>
               
                    <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`${!ifCameraOff&&'hidden'} rounded-lg w-full  max-w-md border`}
                    />
                    
                    <canvas ref={canvasRef} className="hidden" />
                 
                {
                    !ifCameraOff &&
                    <Image src="/offCamera.png" className=' w-full h-full' width={60} height={60}  alt="camera" />

                }
            
            </div>
            <div className=" gap-4">
             { !ifCameraOff &&  <button
                    onClick={startCamera}
                    className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded"
                >
                    {loading?"Starting...":"Start Camera"}
                </button>}
               {ifCameraOff&& <button
                    onClick={capturePhoto}
                    className="bg-green-500 text-white px-4 py-2 cursor-pointer rounded"
                >
                    Capture Photo
                </button>}
            </div>


        </div>
    );
}
