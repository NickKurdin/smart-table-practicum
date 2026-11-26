import {cloneTemplate} from '../lib/utils.js';

/**
 * Инициализирует таблицу и вызывает коллбэк при изменении полей и нажатии кнопок.
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    for (const name of before) {
        const template = cloneTemplate(name);
        root[name] = template;
        root.elements.rows.before(template.container);
    }

    for (const name of after) {
        const template = cloneTemplate(name);
        root[name] = template;
        root.container.append(template.container);
    }

    let inputTimer;

    function triggerAction(action) {
        clearTimeout(inputTimer);
        onAction(action);
    }

    root.container.addEventListener('input', event => {
        if (event.target.type === 'text') {
            clearTimeout(inputTimer);
            inputTimer = setTimeout(triggerAction, 250);
        }
    });
    root.container.addEventListener('change', () => triggerAction());
    root.container.addEventListener('reset', () => {
        clearTimeout(inputTimer);
        setTimeout(triggerAction);
    });
    root.container.addEventListener('submit', event => {
        event.preventDefault();
        triggerAction(event.submitter);
    });

    const render = data => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            for (const [key, value] of Object.entries(item)) {
                const element = row.elements[key];
                if (element) {
                    element.textContent = value ?? '';
                }
            }
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}
