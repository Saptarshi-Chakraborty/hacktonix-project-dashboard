import React from 'react'

const Booth = () => {
    return (
        <div className="container py-2 px-0 mb-4">
            <h1 className="text-center text-decoration-underline">Booth Details</h1>

            {/* <!-- Add new Voter --> */}
            <form className="my-4 border border-2 border-warning p-2 rounded">
                <h2 className="mb-2">Add new Booth</h2>

                {/* <!-- Id (in edit mode) --> */}
                <input type="hidden" className="form-control" id="boothId" value="" />

                {/* <!-- Name --> */}
                <div className="mb-3">
                    <label htmlFor="boothName" className="form-label fw-bold">Booth Name</label>
                    <input type="text" className="form-control" id="boothName" />
                </div>

                {/* <!-- Code --> */}
                <div className="mb-3">
                    <label htmlFor="boothCode" className="form-label fw-bold">Booth Code</label>
                    <input type="text" className="form-control" id="boothCode" />
                </div>

                {/* <!-- Area -->  */}
                <div className="mb-3">
                    <label htmlFor="boothArea" className="form-label fw-bold">Area</label>
                    <input type="text" className="form-control" id="boothArea" />
                </div>

                {/* <!-- Option s --> */}
                <div className="mb-3">
                    <label htmlFor="boothOptions" className="form-label fw-bold">Choose Options for this booth</label>

                    <div id="boothOptions">

                        {/* <!-- <div className="form-check form-check-inline">
                    <input className="form-check-input option" id="opt1-check" type="checkbox" value="OPT1">
                    <label className="form-check-label" htmlFor="opt1-check">Option 1 (OPT1)</label>
                </div> --> */}

                    </div>

                    {/* <!-- Status (in edit mode) --> */}
                    <div className="mb-3" id="boothStatusBox" style={{ display: "none" }}>
                        <label htmlFor="boothStatus" className="form-label">Status</label>
                        <select className="form-select" id="boothStatus" aria-label="Default select example">
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                </div>

                <button type="button" id="resetButton" className="btn btn-lg btn-danger me-3">Clear All</button>
                <button type="button" id="submitButton" className="btn btn-lg btn-success">Submit</button>
            </form>

            <hr />

            {/* <!-- Show all booths --> */}
            <div className="mt-4 py-3">
                <h2 className="mb-3">All Booths</h2>

                {/* <!-- Search bar --> */}
                <div className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search a booth" aria-label="Search" />
                    <button className="btn btn-outline-success">Search</button>
                </div>

                <button className="btn btn-warning mt-3" >Get All Booths</button>

                {/* <!-- Booth List --> */}
                <table className="table table-bordered table-hover my-3">
                    <thead>
                        <tr className="table-dark text-center">
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Code</th>
                            <th scope="col">Areas</th>
                            <th scope="col">Options Available</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>

                    <tbody id="table-body">

                        {/* <!-- <tr>
                    <td>1</td>
                    <td>Booth 1</td>
                    <td>BTH1</td>
                    <td>Jadbpur, Kolkata</td>
                    <td>Option 1 , Option 2 </td>
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

export default Booth