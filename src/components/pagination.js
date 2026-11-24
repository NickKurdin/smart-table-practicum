import {getPages} from '../lib/utils.js';

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.replaceChildren();

    return (data, state, action) => {
        const {rowsPerPage} = state;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let {page} = state;

        switch (action?.name) {
            case 'first': page = 1; break;
            case 'prev': page -= 1; break;
            case 'next': page += 1; break;
            case 'last': page = pageCount; break;
        }

        page = Math.max(1, Math.min(pageCount, page));

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(number => createPage(
            pageTemplate.cloneNode(true), number, page
        )));

        const skip = (page - 1) * rowsPerPage;
        fromRow.textContent = data.length ? skip + 1 : 0;
        toRow.textContent = Math.min(skip + rowsPerPage, data.length);
        totalRows.textContent = data.length;

        return data.slice(skip, skip + rowsPerPage);
    };
};
