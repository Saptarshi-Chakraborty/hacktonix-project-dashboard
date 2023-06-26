import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import DataTable from './DataTable';
import { isObjectEmpty } from '../utils/utils';
import CONSTANT from '../constants';


const Booth = () => {
    const nameRef = useRef(null);
    const codeRef = useRef(null);
    const areaRef = useRef(null);
    const statusRef = useRef(null);

    // State Variables
    const [booth, setBooth] = useState({ id: "", name: "", code: "", area: "", options: "", status: "" });
    const [allOptions, setAllOptions] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);

    // Data Variables
    const getAllDataApi = CONSTANT.boothApi;
    const action = "allBooth";
    const allFields = ["Id", "Name", "Code", "Area", "Options Available", "Status"]
    const dataKeys = ["id", "name", "code", "area", "options", "status"]


    const getAllAvailavleOptions = () => {
        console.log("Getting all available options...");
        const API = CONSTANT.optionsApi;

        let formData = new FormData();
        formData.append("action", "allAvailavleOptions");

        // return;

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

            // console.log(data);

            setAllOptions(() => {
                return data.data;
            })

        }).catch((error) => {
            toast.error("An error happend during fetching all options from server");
            console.table(error);
        })
    }

    const changeOption = () => {
        // console.log("changeOption fired...");

        let allOptionNodes = document.querySelectorAll(".option");
        let allCheckedOptions = [];
        for (let i = 0; i < allOptionNodes.length; i++) {
            let item = allOptionNodes[i];
            let isChecked = item.checked;
            if (isChecked == true)
                allCheckedOptions.push(item.value);
        }
        let allOptionsString = allCheckedOptions.join(",");

        setBooth((oldValue) => {
            return ({
                ...oldValue,
                options: allOptionsString
            })
        });
    }

    const onChange = (ref) => {
        setBooth((oldValue) => {
            return { ...oldValue, [ref.current.name]: ref.current.value }
        })
        // console.log(booth);
    }

    const submitForm = (e) => {
        e.preventDefault();

        // Check all fields
        if (booth.options == "") {
            toast.error("Please select at least one Option for this booth");
            return;
        }

        // Api Call
        const SUBMIT_API = CONSTANT.boothApi;
        let primaryFormData = {
            action: isEditMode ? "editBooth" : "newBooth",
            name: booth.name.trim(),
            code: booth.code.trim(),
            area: booth.area.trim(),
            options: booth.options.trim()
        }

        if (isEditMode == true) {
            primaryFormData['id'] = booth.id.trim();
            primaryFormData['status'] = booth.status.trim();
        }

        // console.table(primaryFormData);
        // return;
        let formData = new FormData();
        for (let key in primaryFormData)
            formData.append(key, primaryFormData[key]);

        const params = { method: "POST", body: formData };

        fetch(SUBMIT_API, params).then(data => data.text()).then((_rawData) => {
            // console.log(_rawData);

            let data;
            try {
                data = JSON.parse(_rawData);
            } catch (error) {
                console.log(error);
                toast.error("INVALID DATA FROM SERVER");
                return;
            }
            // console.log(data);

            if (data.status == 'error') {
                toast.error(`${data.type} - ERROR from Server`);
                return;
            }

            // console.log(`isEditMode: ${isEditMode}`);

            if (isEditMode == false) {
                toast.success(`NEW BOOTH CREATED SUCCESSFULLY - ID ${data.id}`);
                console.log(`New Booth ID : ${data.id}`);
            } else {
                toast.success("BOOTH DATA EDITED SUCCESSFULY");
            }

            getAllAvailavleOptions();
            resetForm();
            setForceUpdate(() => true);
        }).catch((error) => {
            toast.error("Error happend in Fetching Data");
            console.table(error);
        });

    }

    const resetForm = () => {
        if (isEditMode == true) {
            setIsEditMode(() => {
                return false
            })
        }

        setBooth(() => {
            return { id: "", name: "", code: "", area: "", options: "", status: "" }
        })

        let allCheckboxNodes = document.querySelectorAll(".option");
        for (let i = 0; i < allCheckboxNodes.length; i++) {
            allCheckboxNodes[i].checked = false;
        }
    }

    // Using as window.onload
    useEffect(() => {
        return () => {
            getAllAvailavleOptions();

            // Auto Fill test values
            // setBooth((oldValue) => {
            //     return {
            //         ...oldValue,
            //         name: "Booth 8",
            //         code: "BTH8",
            //         area: "Hawaghor, Megher Desh"
            //     }
            // })
        }
    }, [])


    useEffect(() => {
        if (booth.options == "")
            return;


        getAllAvailavleOptions();

        let allCheckboxNodes = document.querySelectorAll(".option");
        for (let i = 0; i < allCheckboxNodes.length; i++) {
            let element = allCheckboxNodes[i];
            if (booth.options && element.checked == false) {
                if (booth.options.includes(element.value)) {
                    element.checked = true;
                }
            }
        }
        changeOption();

    }, [booth.options])


    return (
        <div className="container py-2 px-0 mb-4">

            <h1 className="text-center text-decoration-underline">Booth Details</h1>

            {/* <!-- Add new Voter --> */}
            <form className="my-4 border border-2 border-warning p-2 rounded" onSubmit={submitForm}>

                {/* if isEditMode is true */}
                {isEditMode && <h2 className="mb-2">Edit booth of id : {booth.id}</h2>}

                {/* if isEditMode is false */}
                {isEditMode || <h2 className="mb-2">Add new Booth</h2>}


                {/* <!-- Name --> */}
                <div className="mb-3">
                    <label htmlFor="boothName" className="form-label fw-bold">Booth Name</label>
                    <input value={booth.name} onChange={() => onChange(nameRef)} ref={nameRef} type="text" className="form-control" id="boothName" name='name' required={true} />
                </div>

                {/* <!-- Code --> */}
                <div className="mb-3">
                    <label htmlFor="boothCode" className="form-label fw-bold">Booth Code</label>
                    <input value={booth.code} onChange={() => onChange(codeRef)} ref={codeRef} type="text" className="form-control" id="boothCode" name='code' required={true} />
                </div>

                {/* <!-- Area -->  */}
                <div className="mb-3">
                    <label htmlFor="boothArea" className="form-label fw-bold">Area</label>
                    <input value={booth.area} onChange={() => onChange(areaRef)} ref={areaRef} type="text" className="form-control" id="boothArea" name='area' required={true} />
                </div>

                <input type="hidden" onChange={changeOption} className="form-control" name='options' value={booth.options} disabled={true} />

                {/* <!-- Options --> */}
                <div className="mb-3">
                    <label htmlFor="boothOptions" className="form-label fw-bold">Choose Options for this booth</label>

                    <div id="boothOptions">
                        {(allOptions.length == 0) &&
                            <p>No Option Found</p>
                        }

                        {
                            allOptions.map((item) => {
                                return (
                                    <div onClick={changeOption} key={item.code} className="form-check form-check-inline">
                                        <input className="form-check-input option" id={`${item.code}-check`} type="checkbox" value={item.code} />
                                        <label className="form-check-label" htmlFor={`${item.code}-check`}>{item.name} ({item.code})</label>
                                    </div>
                                )
                            })
                        }

                        {/* <!-- <div className="form-check form-check-inline">
                    <input className="form-check-input option" id="opt1-check" type="checkbox" value="OPT1">
                    <label className="form-check-label" htmlFor="opt1-check">Option 1 (OPT1)</label>
                    </div> --> */}
                    </div>


                    {/* <!-- Status (in edit mode) --> */}
                    <div className="mb-3" id="boothStatusBox" hidden={!isEditMode}>
                        <label htmlFor="boothStatus" className="form-label">Status</label>
                        <select ref={statusRef} value={booth.status} onChange={() => onChange(statusRef)} name='status' className="form-select" id="boothStatus" aria-label="Default select example" required={isEditMode}>
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                </div>

                <button onClick={resetForm} type="reset" className="btn btn-lg btn-danger me-3">Clear All</button>
                <button type="submit" className="btn btn-lg btn-success">{isEditMode ? `Confirm Edit` : 'Submit'}</button>
            </form>

            <hr />

            {/* <!-- Show all booths --> */}
            <DataTable
                typeOfData="Booth"
                dataApi={getAllDataApi}
                fetchingParam={{ action }}
                fieldsHeading={allFields}
                fieldsName={dataKeys}
                setEditMode={setIsEditMode}
                setEditData={setBooth}
                forceUpdate={forceUpdate}
                setForceUpdate={setForceUpdate}
            />


        </div>
    )
}

export default Booth