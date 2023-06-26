import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';
import DataTable from './DataTable';
import CONSTANT from '../constants';

const Options = () => {
    const nameRef = useRef(null);
    const codeRef = useRef(null);
    const statusRef = useRef(null);

    // State Variables
    const [option, setOption] = useState({ id: "", name: "", code: "", status: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);

    // Data Variables
    const getAllDataApi = CONSTANT.optionsApi;
    const action = "allOptions";
    const allFields = ["Id", "Name", "Code", "Status"]
    const dataKeys = ["id", "name", "code", "status"]


    const onChange = (ref) => {
        setOption((oldValue) => {
            return { ...oldValue, [ref.current.name]: ref.current.value }
        })
        // console.log(booth);
    }

    const submitForm = (e) => {
        e.preventDefault();

        // Api Call
        const SUBMIT_API = CONSTANT.optionsApi;
        let primaryFormData = {
            action: isEditMode ? "editOption" : "newOption",
            name: option.name.trim(),
            code: option.code.trim(),
        }

        if (isEditMode == true) {
            primaryFormData['id'] = option.id.trim();
            primaryFormData['status'] = option.status.trim();
        }

        console.table(primaryFormData);
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
                toast.success(`NEW OPTION CREATED SUCCESSFULLY - ID ${data.id}`);
                console.log(`New Option ID : ${data.id}`);
            } else {
                toast.success("OPTION DATA EDITED SUCCESSFULY");
            }

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

        setOption(() => {
            return { id: "", name: "", code: "", status: "" }
        })
    }


    return (
        <div className="container py-2 px-0 mb-4">
            <h1 className="text-center text-decoration-underline">Option Details</h1>

            {/* <!-- Add new Voter --> */}
            <form onSubmit={submitForm} className="my-4 border border-2 border-warning p-2 rounded">
                {/* if isEditMode is true */}
                {isEditMode && <h2 className="mb-2">Edit option of id : {option.id}</h2>}

                {/* if isEditMode is false */}
                {isEditMode || <h2 className="mb-2">Add new Option</h2>}

                {/* <!-- Name --> */}
                <div className="mb-3">
                    <label htmlFor="optionName" className="form-label fw-bold">Option Name</label>
                    <input ref={nameRef} value={option.name} onChange={() => onChange(nameRef)} name='name' type="text" className="form-control" id="optionName" required={true} />
                </div>

                {/* <!-- Code --> */}
                <div className="mb-3">
                    <label htmlFor="optionCode" className="form-label fw-bold">Option Code</label>
                    <input ref={codeRef} value={option.code} onChange={() => onChange(codeRef)} name='code' type="text" className="form-control" id="optionCode" required={true} />
                </div>

                {/* <!-- Status (in edit mode) --> */}
                <div className="mb-3" id="optionStatusBox" hidden={!isEditMode}>
                    <label htmlFor="optionStatus" className="form-label">Status</label>
                    <select ref={statusRef} value={option.status} onChange={() => onChange(statusRef)} name='status' className="form-select" id="optionStatus" aria-label="Default select example" required={isEditMode}>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <button onClick={resetForm} type="reset" className="btn btn-lg btn-danger me-3">Clear All</button>
                <button type="submit" className="btn btn-lg btn-success">{isEditMode ? `Confirm Edit` : 'Submit'}</button>
            </form>

            <hr />

            {/* <!-- Show all options --> */}
            <DataTable
                typeOfData="Option"
                dataApi={getAllDataApi}
                fetchingParam={{ action }}
                fieldsHeading={allFields}
                fieldsName={dataKeys}
                setEditMode={setIsEditMode}
                setEditData={setOption}
                forceUpdate={forceUpdate}
                setForceUpdate={setForceUpdate}
            />


        </div>
    )
}

export default Options