import React from 'react'

const Navbar = () => {
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg ">
            <div className="container-fluid">
                <a className="navbar-brand" href="./">VoteBlock Dashboard</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="./">Voter Details</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="./booth.html">Booth Details</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="./option.html">Options Details</a>
                        </li>


                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar