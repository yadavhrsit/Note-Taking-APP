import "./App.css";

import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import Signup from "./Signup";
import Login from "./Login";
// import Profile from "./Profile";
// import Settings from "./Settings";

import Error from "./Error";
import NoteView from "./NoteView";


function App() {
  return (
    <BrowserRouter>
      <div className="mb-5 bg-slate-900 flex gap-4 p-2 text-white">
        <NavLink to={"/"} className="py-3 px-6 bg-red-500">
          Home
        </NavLink>
        <NavLink to={"/login"} className="py-3 px-6 bg-blue-600">
          Login
        </NavLink>
        <NavLink to={"/signup"} className="py-3 px-6 bg-green-600">
          Signup
        </NavLink>
      </div>
      <Routes>
        <Route path="/" Component={HomePage}></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/signup" Component={Signup}></Route>
        <Route path="/note/:id" Component={NoteView}/>
        <Route path="/error" Component={Error}></Route>
        <Route path="*" element={<Navigate to={"/error"} replace />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
