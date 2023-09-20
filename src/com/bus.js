/**
 * @param {CustomEvent} e
 */
function hookHandler(name, e) {
    e.detail[name] = e.currentTarget;
}

/**
 * @template {HTMLElement}  T
 * @param {T} target
 * @param {string} name
 */
export function attachActionHook(target, name) {
    target.addEventListener("com:element", hookHandler.bind({}, name));
}
