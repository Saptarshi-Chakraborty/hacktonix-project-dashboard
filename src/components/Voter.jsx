import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { isObjectEmpty } from '../utils/utils';
import VoterDataCard from './VoterDataCard';
import DataTable from './DataTable';

const Voter = () => {
    const nameRef = useRef(null);
    const fatherNameRef = useRef(null);
    const genderRef = useRef(null);
    const dobRef = useRef(null);
    const addressRef = useRef(null);
    const boothRef = useRef(null);
    const statusRef = useRef(null);

    // State Variables
    const [voter, setVoter] = useState({ id: "", name: "", fatherName: "", gender: "m", dob: "", address: "", booth: "", status: "" });
    const [allBooths, setAllBooths] = useState([]);
    const [newVoterData, setNewVoterData] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);

    // Data Variables
    const getAllDataApi = "http://localhost/hacktonix-server/voter.php";
    const action = "allVoters";
    const allFields = ["Id", "Name", "Father's Name", "Gender", "DOB", "Address", "Booth", "Status"]
    const dataKeys = ["id", "name", "father_name", "gender", "dob", "address", "booth", "status"]


    const getAllActiveBooths = () => {
        console.log("Getting all active booths...");
        const API = "http://localhost/hacktonix-server/booth.php";

        let formData = new FormData();
        formData.append("action", "allActiveBooths");

        const params = { method: "POST", body: formData }

        fetch(API, params).then((data) => data.text()).then((_rawData) => {
            // console.log(_rawData);

            let data;
            try {
                data = JSON.parse(_rawData);
            } catch (error) {
                console.table(error);
                toast.error("INVALID DATA FROM SERVER");
            }

            if (data.status != "success" || data.data === undefined) {
                toast.error("Server sent a Failed Data");
                return;
            }

            console.log(data);

            setAllBooths(() => {
                return data.data;
            })

            if (voter.booth === "") {
                setVoter((oldValue) => {
                    return { ...oldValue, booth: data.data[0].code }
                });
            }

        }).catch((error) => {
            toast.error("An error happend during fetching all booths");
            console.table(error);
        })
    }

    // Using as window.onload
    useEffect(() => {
        return () => {
            getAllActiveBooths();
            // console.log(`newVoterData is empty: ${isObjectEmpty(newVoterData)}`);

            // Auto Fill test values
            // setVoter((oldValue) => {
            //     return {
            //         ...oldValue,
            //         name: "Name Chakraborty",
            //         fatherName: "Father Chakraborty",
            //         dob: "2003-06-05",
            //         address: "1/2, A B C Road, Chourangi More, Kolkata"
            //     }
            // })
        }
    }, [])


    const onChange = (ref) => {
        setVoter((oldValue) => {
            return { ...oldValue, [ref.current.name]: ref.current.value }
        })
        // console.log(voter);
    }

    const submitForm = (e) => {
        e.preventDefault();
        console.table(voter);

        const SUBMIT_API = "http://localhost/hacktonix-server/voter.php";
        let primaryFormData = {
            action: isEditMode ? "editVoter" : "newVoter",
            name: voter.name.trim(),
            father_name: voter.fatherName.trim(),
            gender: voter.gender.trim(),
            dob: voter.dob.trim(),
            address: voter.address.trim(),
            booth: voter.booth.trim()
        }

        if (isEditMode == true) {
            primaryFormData['id'] = voter.id.trim();
            primaryFormData['status'] = voter.status.trim();
        }

        console.log(primaryFormData);
        // return;
        let formData = new FormData();
        for (let key in primaryFormData)
            formData.append(key, primaryFormData[key]);

        const params = { method: "POST", body: formData };

        fetch(SUBMIT_API, params).then(data => data.text()).then((_rawData) => {
            console.log(_rawData);

            let data;
            try {
                data = JSON.parse(_rawData);
            } catch (error) {
                console.log(error);
                toast.error("INVALID DATA FROM SERVER");
                return;
            }
            console.log(data);

            if (data.status == 'error') {
                toast.error(`${data.type} - ERROR from Server`);
                return;
            }

            console.log(`isEditMode: ${isEditMode}`);
            if (isEditMode == false) {

                setNewVoterData(() => {
                    return {
                        ...voter,
                        id: data.id,
                        qrData: data.qrData
                    }
                })

                toast.success("NEW VOTER CREATED SUCCESSFULLY");
                console.log(`New Voter ID : ${data.id}`);

            } else {
                setNewVoterData(() => {
                    return {
                        ...voter,
                        id: voter.id,
                        qrData: data.qrData
                    }
                })

                toast.success("VOTER DATA EDITED SUCCESSFULY");
            }
            resetForm();

            setForceUpdate(() => true)

        }).catch((error) => {
            toast.error("An error happend during fetching data from server");
            console.table(error);
        });
    }

    const resetForm = () => {
        if (isEditMode == true) {

            setIsEditMode(() => {
                return false
            })
        }

        setVoter(() => {
            return { id: "", name: "", fatherName: "", gender: "m", dob: "", address: "", booth: "", status: "" }
        })
    }


    return (
        <div className="container py-2 px-0 mb-4">
            <h1 className="text-center text-decoration-underline">Voter Details</h1>

            {/* <!-- Add new Voter Form--> */}
            <form className="my-4 border border-2 border-warning p-2 rounded" onSubmit={submitForm}>

                {/* if isEditMode is true */}
                {isEditMode && <h2 className="mb-2">Edit voter of id : {voter.id}</h2>}

                {/* if isEditMode is false */}
                {isEditMode || <h2 className="mb-2">Add new voter</h2>}

                {/* <!-- id (in edit mode) --> */}
                <input type="hidden" value={voter.id} id="voterId" />

                {/* <!-- Name --> */}
                <div className="mb-3">
                    <label className="form-label">Voter's Name</label>
                    <input value={voter.name} onChange={() => onChange(nameRef)} ref={nameRef} type="text" className="form-control" name='name' aria-describedby="nameHelp" required={true} />
                    <div id="nameHelp" className="form-text">Please write the spelling properly</div>
                </div>

                {/* <!-- Father's Name --> */}
                <div className="mb-3">
                    <label className="form-label">Father's Name</label>
                    <input value={voter.fatherName} onChange={() => { onChange(fatherNameRef) }} ref={fatherNameRef} type="text" className="form-control" name='fatherName' required={true} />
                </div>

                {/* <!-- Gender --> */}
                <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select value={voter.gender} ref={genderRef} onChange={() => onChange(genderRef)} className="form-select" name='gender' aria-label="Default select example" required={true}>
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                        <option value="t">Transgender</option>
                        <option value="o">Others</option>
                    </select>
                </div>

                {/* <!-- DOB --> */}
                <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input value={voter.dob} onChange={() => onChange(dobRef)} ref={dobRef} type="date" className="form-control" name="dob" required={false} />
                </div>

                {/* <!-- Address --> */}
                <div className="mb-3">
                    <label className="form-label">Voter's Address</label>
                    <input value={voter.address} onChange={() => onChange(addressRef)} ref={addressRef} type="text" className="form-control" name="address" required={true} />
                </div>

                {/* <!-- Booth --> */}
                <div className="mb-3">
                    <label className="form-label">Booth</label>
                    <select onChange={() => onChange(boothRef)} ref={boothRef} className="form-select" name='booth' aria-label="Default select example" required={true}>
                        {
                            (allBooths.length == 0) &&
                            <option selected={true} value="" disabled={true}>
                                No Booth Found
                            </option>
                        }

                        {
                            allBooths.map((booth) => (
                                <option key={booth.code} value={booth.code}>
                                    {`${booth.name} - ${booth.area}`}
                                </option>
                            ))
                        }
                        {/* <!-- <option value="active">Active</option> --> */}
                    </select>
                </div>

                {/* <!-- Status (in edit mode) --> */}
                <div className="mb-3" id="voterStatusBox" hidden={!isEditMode}>
                    <label htmlFor="voterStatus" className="form-label">Status</label>
                    <select ref={statusRef} value={voter.status} onChange={() => onChange(statusRef)} className="form-select" id="voterStatus" name='status' aria-label="Default select example" required={isEditMode}>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="dead">Dead</option>
                    </select>
                </div>

                <button onClick={resetForm} type="reset" className="btn btn-lg btn-danger me-3" id="resetButton">Clear All</button>
                <button type="submit" className="btn btn-lg btn-success">{isEditMode ? `Confirm Edit` : 'Submit'}</button>
            </form>

            {/* <!-- QR showing Card --> */}
            {
                isObjectEmpty(newVoterData) || <VoterDataCard newVoterData={newVoterData} />
            }

            {/* <!-- Show all voters --> */}
            <DataTable
                typeOfData="Voter"
                dataApi={getAllDataApi}
                fetchingParam={{ action }}
                fieldsHeading={allFields}
                fieldsName={dataKeys}
                setEditMode={setIsEditMode}
                setEditData={setVoter}
                forceUpdate={forceUpdate}
                setForceUpdate={setForceUpdate}
            />


        </div >
    )
}

export default Voter