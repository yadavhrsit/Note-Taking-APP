import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [visibility, setVisibility] = useState("public"); 

  const navigate = useNavigate();
  const token = localStorage.getItem("NoteAppToken");

  async function postData(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3100/notes",
        {
          title,
          content,
          tags,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response && response.status === 201) {
        window.alert("Note Added Successfully");
        window.location.reload();
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.alert("Login is Required to create a Note");
        navigate("/login");
      } else {
        window.alert("Server Not Responding, Please come back later");
      }
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault(); 
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const handleTagRemove = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <form onSubmit={postData}>
      <div className="mb-6">
        <label htmlFor="title" className="block font-semibold text-lg">
          Title
        </label>
        <input
          type="text"
          name="title"
          className="w-full p-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="content" className="block font-semibold text-lg">
          Content
        </label>
        <textarea
          name="content"
          rows="4"
          className="w-full p-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="title" className="block font-semibold text-lg">
          Tags
        </label>
        <input
          type="text"
          value={inputValue}
          className="w-full p-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          onChange={handleInputChange}
          onKeyDown={handleInputKeyPress}
          placeholder="Type tags here..."
        />
        <div className="flex flex-wrap mt-1">
          {tags.map((tag, index) => (
            <div key={index} className="m-1">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                {tag}
                <button
                  type="button"
                  className="ml-1 focus:outline-none"
                  onClick={() => handleTagRemove(index)}
                >
                  <svg
                    className="w-3 h-3 fill-current text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm5 13.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z" />
                  </svg>
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="visibility" className="block font-semibold mr-2 mb-1">
          Visibility:
        </label>
        <select
          name="visibility"
          className="py-2 px-6 border border-gray-300 rounded-md"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value="public">Public</option>
          <option value="hidden">Hidden</option>
          {/* <option value="private">Private</option> */}
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Create Note
      </button>
    </form>
  );
}

export default CreateNote;
