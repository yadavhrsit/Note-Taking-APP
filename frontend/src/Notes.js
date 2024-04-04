import React from 'react'
import dayjs from "dayjs"
function Notes({ loading, notes, currentPage }) {
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {notes.length > 0
            ? notes?.map((note, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-lg p-4 mb-4 shadow"
                >
                  <h3 className="text-lg font-semibold capitalize whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {note.title}
                  </h3>

                  <p className="mt-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {note.content}
                  </p>
                  <p className="mt-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {note.createdBy.username}
                  </p>
                  <div className="flex gap-2">
                    {note.tags.map((tag) => (
                      <p className="mt-2 bg-gray-700 text-white px-3 rounded-sm">
                        {tag}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2">{note.likes.length} Likes</p>
                  <div className="flex gap-2">
                    <p className="mt-2">
                      {dayjs(note.createdAt).format("DD/MM/YYYY")}
                    </p>
                    <p className="mt-2">
                      {dayjs(note.createdAt).format("hh:mm a")}
                    </p>
                  </div>
                </div>
              ))
            : "No Notes to Show"}
        </div>
      )}
    </>
  );
}

export default Notes