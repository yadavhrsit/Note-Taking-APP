import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateNote from "./CreateNote";
import Pagination from "./Pagination";
import Sorting from "./Sorting";
import Notes from "./Notes";


function HomePage() {
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);

  const [sortBy, setSortBy] = useState("recent"); 
  
  const token = localStorage.getItem("NoteAppToken");

  useEffect(() => {
    loadNotes();
  }, [currentPage, sortBy]);

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

 

  return (
    <div className="w-100 max-w-4xl mx-auto p-6 lg:p-10">
      <div className="flex flex-col justify-between gap-5">
        <div className="w-full mb-6">
          <CreateNote />
        </div>

        <div className="w-full mb-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <Sorting sortBy={sortBy} setSortBy={setSortBy} />
          <Notes loading={loading} notes={notes} currentPage={currentPage} />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
