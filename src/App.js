import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";

const App = ({ ...props }) => {
  console.log(props.Prototype);
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
    </Routes>
  );
};

export default App;
