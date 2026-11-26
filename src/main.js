import './fonts/ys-display/fonts.css';
import './style.css';

import {initData} from './data.js';
import {processFormData} from './lib/utils.js';

import {initTable} from './components/table.js';
import {initSearching} from './components/searching.js';
import {initFiltering} from './components/filtering.js';
import {initSorting} from './components/sorting.js';
import {initPagination} from './components/pagination.js';

const api = initData();
let latestRequest = 0;
let displayedCriteria;
let sellersLoaded = false;

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    for (const field of ['totalFrom', 'totalTo']) {
        const value = state[field].trim().replace(',', '.');
        state[field] = value && Number.isFinite(Number(value)) ? value : '';
    }

    return {
        ...state,
        search: state.search.trim(),
        date: state.date.trim(),
        customer: state.customer.trim(),
        rowsPerPage: Number.parseInt(state.rowsPerPage, 10),
        page: Number.parseInt(state.page ?? '1', 10)
    };
}

async function render(action) {
    const requestId = ++latestRequest;
    if (action?.name === 'clear') {
        action.form.elements.namedItem(action.dataset.field).value = '';
    }

    const state = collectState();
    let query = applySearching({}, state);
    query = applyFiltering(query, state);
    query = applySorting(query, action);
    const criteria = JSON.stringify({...query, limit: state.rowsPerPage});
    query = criteria === displayedCriteria
        ? applyPagination(query, state, action)
        : {...query, page: 1, limit: state.rowsPerPage};

    try {
        let result = await api.getRecords(query);
        const lastPage = Math.max(1, Math.ceil(result.total / query.limit));
        if (requestId === latestRequest && query.page > lastPage) {
            query.page = lastPage;
            result = await api.getRecords(query);
        }
        if (requestId !== latestRequest) {
            return;
        }
        if (!sellersLoaded) {
            const {sellers} = await api.getIndexes();
            if (requestId !== latestRequest) {
                return;
            }
            updateSellers(sellers);
            sellersLoaded = true;
        }

        sampleTable.render(result.items);
        updatePagination(result.total, query);
        displayedCriteria = criteria;
        status.textContent = '';
        status.hidden = true;
    } catch {
        if (requestId === latestRequest) {
            status.textContent = 'Could not load sales data. Change a control or reload to try again.';
            status.hidden = false;
        }
    }
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applySearching = initSearching('search');
const {applyFiltering, updateSellers} = initFiltering(sampleTable.filter.elements.searchBySeller);
const {sortByDate, sortByTotal} = sampleTable.header.elements;
const applySorting = initSorting([sortByDate, sortByTotal]);
const {applyPagination, updatePagination} = initPagination(sampleTable.pagination.elements, (button, number, currentPage) => {
    const input = button.querySelector('input');
    input.value = number;
    input.checked = number === currentPage;
    input.defaultChecked = number === 1;
    button.querySelector('span').textContent = number;
    button.setAttribute('aria-label', `Goto page ${number}`);
    return button;
});

const status = document.createElement('p');
status.setAttribute('role', 'status');
status.textContent = 'Loading sales data…';
document.querySelector('#app').append(status, sampleTable.container);
updatePagination(0, {page: 1, limit: collectState().rowsPerPage});
render();
