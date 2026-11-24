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

    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(onAction));
    root.container.addEventListener('submit', event => {
        event.preventDefault();
        onAction(event.submitter);
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
