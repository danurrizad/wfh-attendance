// src/FaceCapture.js
import { useRef } from "react";
import Webcam from "react-webcam";
import Button from "../forms/Button";

export default function FaceCapture({ imageFile, setImageFile, handleSubmit}) {
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageFile(imageSrc);
  };

  const retakeImage = () => {
    setImageFile(null)
  }

  return (
    <div>
        {!imageFile && (
            <div>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  width={1000}
                  videoConstraints={{ facingMode: "user" }}
                />
                <Button className="w-full mt-4" variant="blue" onClick={captureImage}>Capture</Button>
            </div>
        )}
      {imageFile && (
        <>
          <div>
            <img src={imageFile} alt="Captured" width="1000" />
          </div>
          <div className="flex items-center justify-between gap-4 mt-4">
            <Button variant="outline" className="w-full" onClick={retakeImage}>Retake</Button>
            <Button variant="primary" className="w-full" onClick={handleSubmit}>Submit Attendance</Button>
          </div>
        </>
      )}
    </div>
  );
}
