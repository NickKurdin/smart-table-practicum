const baseUrl = 'https://webinars.webdev.education-services.ru/sp7-api';

async function request(path) {
    const response = await fetch(`${baseUrl}/${path}`);
    if (!response.ok) {
        throw new Error(`Sales API request failed (${response.status})`);
    }
    return response.json();
}

export function initData() {
    let indexesRequest;

    function getIndexes() {
        indexesRequest ??= Promise.all([request('sellers'), request('customers')])
            .then(([sellers, customers]) => ({sellers, customers}))
            .catch(error => {
                indexesRequest = undefined;
                throw error;
            });
        return indexesRequest;
    }

    async function getRecords(query) {
        const params = new URLSearchParams(query);
        const [{sellers, customers}, {total, items}] = await Promise.all([
            getIndexes(),
            request(`records?${params}`)
        ]);

        return {
            total,
            items: items.map(record => ({
                id: record.receipt_id,
                date: record.date,
                seller: sellers[record.seller_id],
                customer: customers[record.customer_id],
                total: record.total_amount
            }))
        };
    }

    return {getIndexes, getRecords};
}
