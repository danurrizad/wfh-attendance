// src/FaceCapture.js
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Button from "../forms/Button";
import { useToast } from "../../context/ToastifyContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSadTear, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function FaceCapture({ imageFile, setImageFile, handleSubmit}) {
  const webcamRef = useRef(null);
  const { showError } = useToast();
  const [deviceError, setDeviceError] = useState(false)

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageFile(imageSrc);
  };

  const retakeImage = () => {
    setImageFile(null)
  }

  const handleError = (error) => {
    console.log("Error camera device", error)
    setDeviceError(true)
    showError("Can't use camera device over HTTP!")
  }

  return (
    <div>
        {(!imageFile && !deviceError) && (
            <div>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  width={1000}
                  videoConstraints={{ facingMode: "user" }}
                  onUserMediaError={handleError}
                  onUserMedia={()=>console.log("ABOSRT")}
                />
                <Button className="w-full mt-4" variant="blue" onClick={captureImage}>Capture</Button>
            </div>
        )}
        {deviceError && (
          <div className="flex flex-col items-center justify-center gap-2 p-10">
            <FontAwesomeIcon icon={faSadTear} className="text-5xl text-gray-300"/>
            <p className="text-gray-400">Can't open camera device</p>
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
