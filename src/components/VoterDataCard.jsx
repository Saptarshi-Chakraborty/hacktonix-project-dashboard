import React from 'react'
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { toast } from 'react-toastify';
import '../css/VoterDataCard.css'

const VoterDataCard = ({ newVoterData }) => {
    if (Object.keys(newVoterData).length == 0) {
        newVoterData = {
            name: "My Name",
            fatherName: "Father Name",
            gender: "m",
            dob: "1990-05-06",
            address: "1/2, H C Road, Mountain View, Atlanda",
            booth: "BTH2",
            id: 4,
            qrData: "Hello World"
        }
    }

    let fullGender = "Other";
    if (newVoterData.gender == 'm')
        fullGender = "Male";
    else if (newVoterData.gender == 'f')
        fullGender = "Female";
    else if (newVoterData.gender == 't')
        fullGender = "Transgender";

    let dateOfBirth = new Date(newVoterData.dob).toDateString();

    const qrImage = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${newVoterData.qrData}&chld=H|1&choe=UTF-8`;

    const downloadVoterCard = () => {
        const node = document.getElementById('voter-card');
        console.log(node);

        // return;
        htmlToImage.toPng(node)
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                // document.body.appendChild(img);

                var link = document.createElement('a');
                link.download = `votercard - ${newVoterData.name}.png`;
                link.href = dataUrl
                link.click();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
                toast.error("Error happend in creatig Voter image");
            });
    }



    return (
        <>
            <div className="card my-3 border-0 align-items-center">
                <div id='voter-card' className="d-flex flex-row gap-3 border border-danger w-fit">
                    <div>
                        <img src={qrImage} className="img-fluid rounded-start" alt="..." />
                    </div>

                    <div className="col-md-8">
                        <div className="card-body">
                            <h4 className="card-title">{newVoterData.name}</h4>
                            <p className="card-text mb-0">Voter ID : <b>{newVoterData.id}</b></p>
                            <p className="card-text mb-0">Father : <b>{newVoterData.fatherName}</b></p>
                            <p className="card-text mb-0">Gender : <b>{fullGender}</b></p>
                            <p className="card-text mb-0">Date of Birth : <b>{dateOfBirth}</b></p>
                            <p className="card-text mb-0">Address : <b>{newVoterData.address}</b></p>
                            <p className="card-text mb-0">Booth : <b>{newVoterData.booth}</b></p>

                            <p className="card-text w-fit pt-1"><small className="text-body-secondary">Generated at : {new Date().toString()}</small></p>
                        </div>
                    </div>
                </div>
                <button onClick={downloadVoterCard} className='btn btn-primary' id='downloadButton'>Download Your Voter Card</button>
            </div >

            <div id='cardTemplate' className="hidden" style={{ display: "none" }}>
                Hello Paaji
            </div>
        </>

    )
}

export default VoterDataCard