function initPagination() {
  const itemsPerPage = 6, maxVisible = 10;
  const container = document.getElementById('pagination-container');
  const controls = document.getElementById('pagination-controls');
  if (!container || !controls) return;
  
  const items = Array.from(container.querySelectorAll('[data-pagination-item]'));
  if (items.length <= itemsPerPage) return;
  
  let currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const showPage = (page) => {
    const start = (page - 1) * itemsPerPage;
    items.forEach((item, i) => item.style.display = (i >= start && i < start + itemsPerPage) ? '' : 'none');
    window.history.pushState({ page }, '', page === 1 ? window.location.pathname : `${window.location.pathname}?page=${page}`);
  };
  
  const createBtn = (text, page, isActive = false) => {
    const btn = document.createElement(isActive ? 'span' : 'a');
    if (!isActive) {
      btn.href = page === 1 ? window.location.pathname : `?page=${page}`;
      btn.addEventListener('click', (e) => { e.preventDefault(); currentPage = page; showPage(currentPage); createControls(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
    btn.className = `tech-tag pagination-btn${isActive ? ' pagination-active' : ''}`;
    btn.textContent = text;
    return btn;
  };
  
  const getPages = () => {
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  
  const createControls = () => {
    controls.innerHTML = '';
    if (currentPage > 1) controls.appendChild(createBtn('← Back', currentPage - 1));
    getPages().forEach(p => controls.appendChild(createBtn(p, p, p === currentPage)));
    if (currentPage < totalPages) controls.appendChild(createBtn('Next →', currentPage + 1));
    controls.style.display = 'flex';
  };
  
  showPage(currentPage);
  createControls();
}

