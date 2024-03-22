import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestedPassword,setSuggestedPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== repeatPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3100/user/register", {
        username,
        password,
      });

      window.alert(response.data.message);

    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("An error occurred during signup");
    }
  };

  function generatePassword(){
    const newPassword = Math.random().toString(36).slice(-8); 
    setSuggestedPassword(newPassword);
  }

  function copyPassword(){
    navigator.clipboard.writeText(suggestedPassword);
    window.alert("Password Copied to Clipboard")
  }

  return (
    <div className="p-10 bg-green-200">
      <form
        className="bg-gray-700 w-1/2 mx-auto px-4 py-8 rounded-md text-white"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-4xl mb-6">Signup Page</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            className="p-4 w-full bg-gray-800 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="p-4 w-full bg-gray-800 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="bg-green-800 mt-2 p-2"
            onClick={generatePassword}
          >
            Suggest Password
          </button>
          {suggestedPassword && (
            <p className="text-white font-semi-bold cursor-pointer" onClick={copyPassword}>{suggestedPassword}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="repeat-password" className="block mb-2">
            Repeat Password
          </label>
          <input
            type="password"
            placeholder="Enter Repeat Password"
            className="p-4 w-full bg-gray-800 rounded"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>
        {errorMessage && (
          <div className="text-red-600 mb-4">{errorMessage}</div>
        )}
        <div>
          <button
            type="submit"
            className="bg-green-600 w-full py-4 rounded text-white"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
