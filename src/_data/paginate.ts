// Pagination helper for Lume templates
export function paginate(array, page = 1, perPage = 6) {
  const total = array.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    items: array.slice(start, end),
    page,
    perPage,
    total,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}
