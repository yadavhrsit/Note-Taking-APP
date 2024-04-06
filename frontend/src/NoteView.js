import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function NoteView() {
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("NoteAppToken");

  const noteId = useParams("id");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:3100/notes/${noteId.id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setNote(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  });
  return <div>{<p>{note.title}</p>}</div>;
}

export default NoteView;
