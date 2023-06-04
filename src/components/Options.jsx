import React from 'react'

const Options = () => {
    return (
        <div className="container py-2 px-0 mb-4">
            <h1 className="text-center text-decoration-underline">Option Details</h1>

            {/* <!-- Add new Voter --> */}
            <form className="my-4 border border-2 border-warning p-2 rounded">
                <h2 className="mb-2">Add new Option</h2>

                {/* <!-- id (in edit mode) --> */}
                <input type="hidden" value="" id="optionId" />

                {/* <!-- Name --> */}
                <div className="mb-3">
                    <label htmlFor="optionName" className="form-label fw-bold">Option Name</label>
                    <input type="text" className="form-control" id="optionName" />
                </div>

                {/* <!-- Code --> */}
                <div className="mb-3">
                    <label htmlFor="optionCode" className="form-label fw-bold">Option Code</label>
                    <input type="text" className="form-control" id="optionCode" />
                </div>

                {/* <!-- Status (in edit mode) --> */}
                <div className="mb-3" id="optionStatusBox" style={{ display: "none" }}>
                    <label htmlFor="optionStatus" className="form-label">Status</label>
                    <select className="form-select" id="optionStatus" aria-label="Default select example">
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <button type="button" id="resetButton" className="btn btn-lg btn-danger me-3">Clear All</button>
                <button type="button" id="submitButton" className="btn btn-lg btn-success">Submit</button>
            </form>

            <hr />

            {/* <!-- Show all options --> */}
            <div className="mt-4 py-3">
                <h2 className="mb-3">All Options</h2>

                {/* <!-- Search bar --> */}
                <div className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search for an option" aria-label="Search" />
                    <button className="btn btn-outline-success">Search</button>
                </div>

                <button className="btn btn-warning mt-3" >Get All Options</button>

                {/* <!-- Options List --> */}
                <table className="table table-bordered table-hover my-3">
                    <thead>
                        <tr className="table-dark text-center">
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Code</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>

                    <tbody id="table-body">
                        {/* <!-- <tr>
                    <td>1</td>
                    <td>Option 1</td>
                    <td>OPT1</td>
                    <td>
                        <span className="badge text-bg-success">Active</span>
                    </td>
                    <td className="text-center">
                        <button type="button" className="btn btn-outline-primary">Edit</button>
                    </td>
                </tr> --> */}
                    </tbody>

                </table>
            </div>


        </div>
    )
}

export default Options