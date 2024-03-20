import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3100/user/login", {
        username,
        password,
      });

      window.alert(response.data.message);

      localStorage.setItem("NoteAppToken", response.data.token);
      navigate("/");

    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        setErrorMessage("No response received from the server.");
      } else {
        setErrorMessage("An error occurred while processing your request.");
      }
    }
  };

  return (
    <div className="p-10 bg-blue-200">
      <form
        className="bg-gray-700 w-fit px-4 py-20 mx-auto rounded-md text-2xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-white mb-12 text-4xl">Login Page</h2>
        <div className="my-4 px-4">
          <label htmlFor="username"></label>
          <input
            type="text"
            placeholder="Enter Username"
            className="p-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div className="my-4 px-4">
          <label htmlFor="password"></label>
          <input
            type="password"
            placeholder="Enter Password"
            className="p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        {errorMessage && (
          <div className="text-red-600 px-4">{errorMessage}</div>
        )}

        <div className="px-4">
          <button
            type="submit"
            className="bg-green-600 w-full text-white"
            style={{ lineHeight: "60px", verticalAlign: "middle" }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
