import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./screen/Landing";
import Dashboard from "./screen/Dashboard";
import Login from "./screen/Login"
import PolicyCreator from "./screen/CreatePolicy";
import Signup from "./screen/Signup";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/update_policy" element={<PolicyCreator />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
