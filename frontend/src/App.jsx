import React from "react";
import LandingPage from "./pages/LandingPage";
import Image from "./pages/Image";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Image" element={<Image />} />
    </Routes>
    </>
  );
}

export default App;