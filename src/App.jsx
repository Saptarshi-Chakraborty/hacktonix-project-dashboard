import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from './components/Navbar';
import Voter from './components/Voter';

function App() {

  return (
    <>
      <Navbar />
      <Voter/>
      {/* <VoterDataCard /> */}
    </>
  )
}

export default App
