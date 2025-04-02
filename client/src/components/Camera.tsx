import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import Webcam from "react-webcam";

// Platform detection utility functions
const isPlatform = (platform: string): boolean => {
  return Capacitor.getPlatform() === platform;
};

interface CameraProps {
  onImageCapture: (imageData: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onImageCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isNative, setIsNative] = useState(false);

  // Check if running in native app context
  useEffect(() => {
    setIsNative(isPlatform('ios') || isPlatform('android'));
  }, []);

  // Native camera capture using Capacitor
  const takePictureNative = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: 'Take a photo of your food',
        promptLabelCancel: 'Cancel',
        correctOrientation: true
      });

      if (image.dataUrl) {
        setImageSrc(image.dataUrl);
        onImageCapture(image.dataUrl);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  // Web camera capture
  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImageSrc(imageSrc);
      onImageCapture(imageSrc);
      setIsCameraActive(false);
    }
  }, [webcamRef, onImageCapture]);

  // File picker for both native and web
  const handleFilePicker = async () => {
    if (isNative) {
      try {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos,
          correctOrientation: true
        });

        if (image.dataUrl) {
          setImageSrc(image.dataUrl);
          onImageCapture(image.dataUrl);
        }
      } catch (error) {
        console.error('Photo gallery error:', error);
      }
    } else {
      // Web file upload
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageSrc(result);
      onImageCapture(result);
    };
    reader.readAsDataURL(file);
  };

  const activateCamera = () => {
    if (isNative) {
      takePictureNative();
    } else {
      setIsCameraActive(true);
    }
  };

  const videoConstraints = {
    width: 720,
    height: 540,
    facingMode: "environment"
  };

  return (
    <div className="flex flex-col">
      <div className="camera-container border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
        {isCameraActive ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        ) : (
          <div id="preview-container" className="w-full h-full relative">
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt="Food preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <i className="fas fa-camera text-gray-500 text-2xl"></i>
                </div>
                <p className="text-gray-500 font-medium">No image selected</p>
                <p className="text-gray-400 text-sm mt-2">Take a photo or upload an image of your food</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-3 mb-4">
        <Button
          className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center"
          onClick={isCameraActive ? handleCapture : activateCamera}
        >
          <i className="fas fa-camera mr-2"></i>
          {isCameraActive ? "Take Photo" : "Capture Photo"}
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
          onClick={handleFilePicker}
        >
          <i className="fas fa-upload mr-2"></i>
          Upload Image
        </Button>
        
        {/* Keep file input for web fallback */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      <p className="text-xs text-gray-400 text-center mb-4">
        For best results, make sure the food is clearly visible and well-lit
      </p>
    </div>
  );
};

export default Camera;
