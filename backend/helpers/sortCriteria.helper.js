// Helper function to get sort criteria
exports.getSortCriteria = (sortBy)=> {
  let sortCriteria = {};

  switch (sortBy) {
    case "most_liked":
      sortCriteria.likes = -1;
      break;
    case "most_commented":
      sortCriteria["comments.length"] = -1;
      break;
    case "recent":
      sortCriteria.createdAt = -1;
      break;
    case "recently_commented":
      sortCriteria["comments.createdAt"] = -1;
      break;
    default:
      sortCriteria.createdAt = -1;
  }

  return sortCriteria;
}
