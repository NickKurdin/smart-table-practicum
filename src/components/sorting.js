import {sortMap} from '../lib/sort.js';

export function initSorting(columns) {
    return (query, action) => {
        if (action?.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];
            for (const column of columns) {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            }
        }

        const activeColumn = columns.find(column => column.dataset.value !== 'none');
        if (!activeColumn) {
            return query;
        }

        const {field, value} = activeColumn.dataset;
        return {...query, sort: `${field}:${value}`};
    };
}
