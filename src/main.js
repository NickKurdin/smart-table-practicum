import './fonts/ys-display/fonts.css';
import './style.css';

import {data as sourceData} from './data/dataset_1.js';
import {initData} from './data.js';
import {processFormData} from './lib/utils.js';

import {initTable} from './components/table.js';
import {initSearching} from './components/searching.js';
import {initFiltering} from './components/filtering.js';
import {initSorting} from './components/sorting.js';
import {initPagination} from './components/pagination.js';

const {data, sellers} = initData(sourceData);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    return {
        ...state,
        search: state.search.trim(),
        rowsPerPage: Number.parseInt(state.rowsPerPage, 10),
        page: Number.parseInt(state.page ?? '1', 10),
        total: [state.totalFrom, state.totalTo].map(value => {
            const number = Number(value.trim().replace(',', '.'));
            return value.trim() && Number.isFinite(number) ? number : undefined;
        })
    };
}

function render(action) {
    const state = collectState();
    let result = applySearching(data, state);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);
    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applySearching = initSearching('search');
const applyFiltering = initFiltering(sampleTable.filter.elements, {searchBySeller: sellers});
const {sortByDate, sortByTotal} = sampleTable.header.elements;
const applySorting = initSorting([sortByDate, sortByTotal]);
const applyPagination = initPagination(sampleTable.pagination.elements, (button, number, currentPage) => {
    const input = button.querySelector('input');
    input.value = number;
    input.checked = number === currentPage;
    input.defaultChecked = number === 1;
    button.querySelector('span').textContent = number;
    button.setAttribute('aria-label', `Goto page ${number}`);
    return button;
});

document.querySelector('#app').append(sampleTable.container);
render();
