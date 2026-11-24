import {sortCollection, sortMap} from '../lib/sort.js';

export function initSorting(columns) {
    return (data, state, action) => {
        if (action?.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];
            columns.forEach(column => {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        }

        const activeColumn = columns.find(column => column.dataset.value !== 'none');
        return sortCollection(data, activeColumn?.dataset.field, activeColumn?.dataset.value);
    };
}
