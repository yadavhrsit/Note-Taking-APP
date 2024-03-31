import React from 'react'

function Sorting({ sortBy, setSortBy }) {
  return (
    <div className="flex mb-4">
      <label htmlFor="sortBy" className="block font-semibold mr-2">
        Sort By:
      </label>
      <select
        name="sortBy"
        className="p-2 border border-gray-300 rounded-md"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="recent">Recent</option>
        <option value="most_liked">Most Liked</option>
        <option value="most_commented">Most Commented</option>
        <option value="recently_commented">Recently Commented</option>
      </select>
    </div>
  );
}

export default Sorting