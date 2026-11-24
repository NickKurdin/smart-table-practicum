import {createComparison, defaultRules} from '../lib/compare.js';

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    for (const [name, index] of Object.entries(indexes)) {
        for (const value of new Set(Object.values(index))) {
            elements[name].add(new Option(value, value));
        }
    }

    return (data, state, action) => {
        if (action?.name === 'clear') {
            const field = action.dataset.field;
            action.form.elements.namedItem(field).value = '';
            state = {...state, [field]: ''};
        }

        return data.filter(row => compare(row, state));
    };
}
