import React, { useEffect, useRef, useState } from 'react';
import '../../public/styles/Scanner.css';
import { toast } from 'react-toastify';

const Camera = ({ voter, isEditMode, voterImages, setVoterImages }) => {

    // Ref variables
    const videoElementRef = useRef(null);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    // State variables
    const [cameraActive, setCameraActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [images, setImages] = useState([]);

    useEffect(() => {

        startCamera();


    }, []);


    // Start camera
    const startCamera = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    videoElementRef.current.srcObject = stream;
                    videoElementRef.current.play();
                    setCameraActive(true);
                })
                .catch(err => {
                    console.log(err);
                    setErrorMessage('Camera is not working');
                });
        }
    }

    // Function to switch the camera
    const switchCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');

                if (videoDevices.length > 1) {
                    // Find the currently active camera
                    const currentCameraIndex = videoDevices.findIndex(device => {
                        return device.label === videoElementRef.current.srcObject.getVideoTracks()[0].label;
                    });

                    // Calculate the index of the next camera to switch to
                    const nextCameraIndex = (currentCameraIndex + 1) % videoDevices.length;

                    // Get the constraints for the next camera
                    const nextCamera = videoDevices[nextCameraIndex];
                    const constraints = { video: { deviceId: { exact: nextCamera.deviceId } } };

                    // Stop the current stream
                    videoElementRef.current.srcObject.getTracks().forEach(track => track.stop());

                    // Start the new camera
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    videoElementRef.current.srcObject = stream;
                    videoElementRef.current.play();
                } else {
                    toast.warn("Only one camera available.");
                }
            } catch (err) {
                console.log(err);
                toast.error('Error switching camera');
                setErrorMessage('Error switching camera');
            }
        }
    }


    // Stop camera
    const stopCamera = () => {
        if (videoElementRef.current.srcObject) {
            videoElementRef.current.srcObject.getTracks().forEach(track => track.stop());
            setCameraActive(false);
        }
    }

    // Capture image (max 4 images)
    const captureImage = (e) => {
        e.preventDefault();
        console.log("Clicking image...");
        if (images.length < 4) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoElementRef.current, 0, 0, "400", "300");
            const image = canvasRef.current.toDataURL('image/png');
            setImages([...images, image]);

            canvasRef.current.toBlob((blob) => {
                const file = new File([blob], "image.png", { type: "image/png" });
                setVoterImages([...voterImages, file]);
            });
        }
        else {
            toast.error('Maximum 4 images can be captured');
        }
    }




    return (
        <>
            {
                (isEditMode === false && voter.name.length > 3 && voter.fatherName.length > 3 && voter.dob != "" && voter.address.length > 3) ?

                    <div className="w-100 d-flex flex-column my-3">
                        <div className='d-flex flex-column' style={{ width: "fit-content" }}>
                            <h3 className="">Click images of Voter ({images.length}/4)</h3>


                            <video ref={videoElementRef} className="video" autoPlay={true} style={{ borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }} />
                            <canvas ref={canvasRef} height="300px" width="400px" className="canvas" style={{ display: "none" }} />

                            {
                                (images.length < 4) &&
                                <button type="button" className='btn btn-small btn-primary' style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }} onClick={captureImage}>Capture Image</button>
                            }

                            {
                                (images.length < 4) &&
                                <button type="button" className='btn btn-small btn-primary' style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }} onClick={switchCamera}>Switch Image</button>
                            }

                        </div>

                        {/* Make a 4 by 4 grid and fit the images in equal spaces and fill the entire availavle space */}
                        <div className="my-2 d-flex flex-row justify-content-space-evenly" style={{ width: "100vw !important" }}>
                            {
                                images.map((image, index) => {
                                    return (
                                        // image of height of one fourth of the video
                                        <img src={image} key={index} width="250vw" />
                                    )
                                })
                            }
                        </div>

                    </div>

                    :

                    <div>Fill other fields to access camera</div>
            }
        </>
    );
};

export default Camera;
