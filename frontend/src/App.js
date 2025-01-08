import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CVEList from "./components/CVEList";
import CVEDetails from "./components/CVEDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CVEList />} />
        <Route path="/cve/:id" element={<CVEDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
