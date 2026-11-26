const filterNames = ['date', 'customer', 'seller', 'totalFrom', 'totalTo'];

export function initFiltering(sellerSelect) {
    function updateSellers(sellers) {
        for (const name of new Set(Object.values(sellers))) {
            sellerSelect.add(new Option(name, name));
        }
    }

    function applyFiltering(query, state) {
        const filters = {};
        for (const name of filterNames) {
            const value = state[name];
            if (value !== '') {
                filters[`filter[${name}]`] = value;
            }
        }
        return {...query, ...filters};
    }

    return {applyFiltering, updateSellers};
}
