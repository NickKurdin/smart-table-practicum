import {getPages} from '../lib/utils.js';

export function initPagination({pages, fromRow, toRow, totalRows}, createPage) {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.replaceChildren();
    let pageCount = 1;

    function applyPagination(query, state, action) {
        const limit = state.rowsPerPage;
        let {page} = state;

        switch (action?.name) {
            case 'first': page = 1; break;
            case 'prev': page -= 1; break;
            case 'next': page += 1; break;
            case 'last': page = pageCount; break;
        }

        page = Math.max(1, Math.min(pageCount, page));
        return {...query, page, limit};
    }

    function updatePagination(total, {page, limit}) {
        pageCount = Math.ceil(total / limit);
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(number => createPage(
            pageTemplate.cloneNode(true), number, page
        )));

        const skip = (page - 1) * limit;
        fromRow.textContent = total ? skip + 1 : 0;
        toRow.textContent = Math.min(skip + limit, total);
        totalRows.textContent = total;
    }

    return {applyPagination, updatePagination};
}
