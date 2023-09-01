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
            context.drawImage(videoElementRef.current, 0, 0, "800", "600");
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
                            <canvas ref={canvasRef} height="600px" width="800px" className="canvas" style={{ display: "none" }} />

                            {
                                (images.length < 4) &&
                                <button type="button" className='btn btn-small btn-primary' style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }} onClick={captureImage}>Capture Image</button>
                            }

                        </div>

                        {/* Make a 4 by 4 grid and fit the images in equal spaces and fill the entire availavle space */}
                        <div className="my-2 d-flex flex-row justify-content-space-evenly" style={{width: "100vw !important"}}>
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
