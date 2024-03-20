import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("NoteAppToken");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3100/notes")
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function postData(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3100/notes",
        {
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.status === 201) {
        window.alert("Note Added Successfully");
        setNotes([...notes, response.data]);
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

  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between gap-5">
        <div className="w-1/2">
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
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Create Note
            </button>
          </form>
        </div>

        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {notes.map((note, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-lg p-4 mb-4 shadow"
                >
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <p className="mt-2">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
