import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import Sorting from "./Sorting";
import Notes from "./Notes";
import axios from "axios";

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    async function loadNotes() {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3100/notes?page=${currentPage}&sortBy=${sortBy}`
        );

        // const response = await axios.get(
        //   `http://localhost:3100/notes/user?page=${currentPage}&sortBy=${sortBy}`,
        //   {
        //     headers: {
        //       Authorization: token,
        //     },
        //   }
        // );
        setNotes(response.data.notes);
        const pagesArray = Array.from(
          { length: response.data.totalPages },
          (_, i) => i + 1
        );
        setTotalPages(pagesArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [currentPage, sortBy]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Notes</h2>
      <Sorting sortBy={sortBy} setSortBy={setSortBy} />
      <Notes loading={loading} notes={notes} currentPage={currentPage} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default NotesList;
