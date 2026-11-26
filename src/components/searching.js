export function initSearching(searchField) {
    return (query, state) => {
        const search = state[searchField];
        return search ? {...query, search} : query;
    };
}
